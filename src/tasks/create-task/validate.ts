import type {Request} from './handler';

export async function validate(accountId: string, body: Request['body']) {
  const {projectId, featureId, releaseId, executiveId} = body;

  await Promise.all([
    validateProject(projectId),
    validateFeature(featureId),
    validateRelease(releaseId),
    validateExecutive(executiveId),
  ]);
}

async function validateProject(executiveId: string) {
  return executiveId;
}

async function validateFeature(featureId: string) {
  return featureId;
}

async function validateRelease(releaseId: string) {
  return releaseId;
}

async function validateExecutive(executiveId: string) {
  return executiveId;
}
