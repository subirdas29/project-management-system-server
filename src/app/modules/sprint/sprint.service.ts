import mongoose, { Types } from 'mongoose';
import httpStatus from 'http-status';

import { Sprint } from './sprint.model';
import { TSprint } from './sprint.interface';
import { Project } from '../project/project.model';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

const createSprint = async (payload: {
  title: string;
  projectId: string;
  startDate: string;
  endDate: string;
}) => {
  const projectObjectId = new Types.ObjectId(payload.projectId);

  // ensure project exists (and not deleted)
  const project = await Project.findOne({ _id: projectObjectId,  });
  if (!project) throw new AppError(httpStatus.NOT_FOUND, 'Project not found');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const lastSprint = await Sprint.findOne({
      projectId: projectObjectId,
    })
      .sort({ sprintNumber: -1 })
      .session(session);

    const nextSprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;

    const nextOrder = nextSprintNumber;

    const sprintDoc = await Sprint.create(
      [
        {
          title: payload.title,
          projectId: projectObjectId,
          sprintNumber: nextSprintNumber,
          order: nextOrder,
          startDate: new Date(payload.startDate),
          endDate: new Date(payload.endDate),
          
        } as TSprint,
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return sprintDoc[0];
  } catch (e) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create sprint');
  }
};

const getProjectSprints = async (projectId: string, query: Record<string, unknown>) => {
  const projectObjectId = new Types.ObjectId(projectId);

  const qb = new QueryBuilder(
    Sprint.find({ projectId: projectObjectId,  }).sort({ order: 1 }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  return {
    result: await qb.modelQuery,
    meta: await qb.countTotal(),
  };
};

const getSingleSprint = async (sprintId: string) => {
  const sprint = await Sprint.findOne({ _id: sprintId,  });
  if (!sprint) throw new AppError(httpStatus.NOT_FOUND, 'Sprint not found');
  return sprint;
};

const updateSprint = async (
  sprintId: string,
  payload: Partial<TSprint>,
) => {
  const safePayload: Partial<TSprint> = {
    title: payload.title,
    startDate: payload.startDate,
    endDate: payload.endDate,
  };

  const updated = await Sprint.findOneAndUpdate(
    { _id: sprintId,  },
    safePayload,
    { new: true },
  );

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sprint not found');
  }

  return updated;
};



const deleteSprint = async (sprintId: string) => {
  const deleted = await Sprint.findByIdAndDelete(sprintId);

  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sprint not found');
  }

  return null;
};



const reorderSprints = async (payload: {
  projectId: string;
  items: { sprintId: string; order: number }[];
}) => {
  const projectObjectId = new Types.ObjectId(payload.projectId);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const sprintIds = payload.items.map(
      (i) => new Types.ObjectId(i.sprintId),
    );

 
    const count = await Sprint.countDocuments({
      _id: { $in: sprintIds },
      projectId: projectObjectId,
    }).session(session);

    if (count !== payload.items.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid sprint list');
    }


    const tempOps = payload.items.map((i, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(i.sprintId), projectId: projectObjectId },
        update: { $set: { order: -(index + 1) } },
      },
    }));

    await Sprint.bulkWrite(tempOps, { session });


    const finalOps = payload.items.map((i) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(i.sprintId), projectId: projectObjectId },
        update: { $set: { order: i.order } },
      },
    }));

    await Sprint.bulkWrite(finalOps, { session });

    await session.commitTransaction();
    return null;
  } catch (e) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to reorder sprints');
  } finally {
    session.endSession();
  }
};


export const SprintService = {
  createSprint,
  getProjectSprints,
  getSingleSprint,
  updateSprint,
  deleteSprint,
  reorderSprints,
};
