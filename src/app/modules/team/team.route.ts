import express from 'express';
import { TeamController } from './team.controller';
import validationRequest from '../../middlewares/validateRequest';
import { teamValidation } from './team.validation';

const router = express.Router();

router.post(
  '/',
  validationRequest(teamValidation.addTeamMemberSchema),
  TeamController.addTeamMember,
);

router.get('/project/:projectId', TeamController.getProjectTeam);

router.patch('/:teamId', TeamController.updateTeamMember);

router.delete('/:teamId', TeamController.removeTeamMember);

export const TeamRoutes = router;
