import useTraverseTree from "./Hooks/use-traverse-tree";

const compareJSON = async(devJSON: any, liveJSON: any) => {

    const { getIds } = useTraverseTree();
    
    const devIds = getIds(devJSON);
    const liveIds = getIds(liveJSON);
    
    console.log(devIds);
    console.log(liveIds);



        // SYNCED: items that exist in both AND include differences


        // NEW: loop devTree and check if dne


        // DELETE: loop liveTree and check if dne


        // else, return tree should contain differences: null

};

export { compareJSON };