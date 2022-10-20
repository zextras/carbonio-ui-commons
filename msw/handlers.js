import { rest } from 'msw';
import { handleCreateFolderRequest } from './handle-create-folder';

export const handlers = [rest.post('/service/soap/CreateFolderRequest', handleCreateFolderRequest)];
