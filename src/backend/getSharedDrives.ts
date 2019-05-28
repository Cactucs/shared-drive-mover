import addFolderPathNames from './addFolderPathNames';
import listFoldersInFolder from './listFoldersInFolder';

function addSharedDriveName(sharedDrive: NamedRecord): NamedRecord
{
	if(sharedDrive.name)
	{
		return sharedDrive;
	}
	const response = Drive.Drives!.get(sharedDrive.id, {fields: 'name'});
	return {id: sharedDrive.id, name: response.name!};
}

function listSharedDrives(): Array<NamedRecord>
{
	let ret = [];
	let pageToken = null;
	do
	{
		const response: GoogleAppsScript.Drive.Schema.DriveList = Drive.Drives!.list({
			pageToken: pageToken,
			maxResults: 100,
			fields: 'nextPageToken, items(id, name)'
		});
		for(let item of response.items!)
		{
			ret.push({id: item.id!, name: item.name!});
		}
		pageToken = response.nextPageToken;
	} while (pageToken !== undefined);
	return ret;
};

export default function(path: Array<NamedRecord>): PathResponse
{
	if(path.length == 0)
	{
		return {path: [], children: listSharedDrives()};
	}
	let namedPath = [addSharedDriveName(path[0])];
	if(path.length > 1)
	{
		namedPath.push(...addFolderPathNames(path.slice(1)));
	}
	return {path: namedPath, children: listFoldersInFolder(path[path.length - 1].id)};
};
