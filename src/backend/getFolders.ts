import addFolderPathNames from './addFolderPathNames';
import listFoldersInFolder from './listFoldersInFolder';

export default function(path: Array<NamedRecord>): PathResponse
{
	const root = path.length === 0 ? 'root' : path[path.length - 1].id;
	return {path: addFolderPathNames(path), children: listFoldersInFolder(root)};
};
