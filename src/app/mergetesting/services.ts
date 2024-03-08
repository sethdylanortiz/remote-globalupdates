import useTraverseTree from "./Hooks/use-traverse-tree";

export type TreeData = { parentId: number, id: number, fileValue: string | null }

const deleteJSON = {
    "name": "rootdir",
    "__id": 100,
    "__isFolder": true,
    "__items": [
        {
            "name": "stats",
            "__id": 65,
            "__isFolder": true,
            "__items": []
        }
    ]
}

// function to compare two tree's values
const compareTrees = async(devJSON: any, liveJSON: any) => {

    const { getTreeData, markTree } = useTraverseTree();
    const devTreeData = getTreeData(devJSON); 
    console.log("------------------------------------------------------------");
    console.log("------------------------------------------------------------");
    const liveTreeData = getTreeData(liveJSON);
    console.log("devTreeData: "); console.log(devTreeData);
    console.log("liveTreeData: "); console.log(liveTreeData);

    // SYNCED: items that exist in both AND include differences
    var editedItems = new Array();
    devTreeData.map((item: TreeData) => {
        // find __id's that exist in both objs && contain differnce in entry
        let found_index = liveTreeData.findIndex((liveItem: TreeData) => liveItem.id == item.id);

        if(found_index !== -1 && liveTreeData[found_index].fileValue !== null
             && liveTreeData[found_index].fileValue !== item.fileValue)
        {
            editedItems.push({
                id: item.id,
                devFileValue: item.fileValue,
                liveFileValue: liveTreeData[found_index].fileValue
            });
        }
    });
    console.log("editedItems: "); console.log(editedItems);

    // NEW: loop devTree and check if dne
    const newItems = devTreeData.filter((item: TreeData) => {
        if(!liveTreeData.find(({ id }) => id == item.id))
            return item;
    });
    console.log("newItems: "); console.log(newItems);

    // DELETE: loop liveTree and check if dne
    const deletedItems = liveTreeData.filter((item: TreeData) => {
        if(!devTreeData.find(({ id }) => id == item.id))
            return item;
    });
    console.log("deletedItems: "); console.log(deletedItems);
    
    // else, return tree should contain differences: null

    var differerenceTree = markTree(liveJSON, "Edited", editedItems)
    differerenceTree = markTree(differerenceTree, "Deleted", deletedItems);
    differerenceTree = markTree(differerenceTree, "Edited", editedItems);


    console.log(JSON.stringify(differerenceTree, null, 4));

};

export { compareTrees };