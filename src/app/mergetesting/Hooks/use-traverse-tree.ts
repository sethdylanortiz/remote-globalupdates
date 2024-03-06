const useTraverseTree = () => {

    // https://www.tutorialspoint.com/fetching-object-keys-using-recursion-in-javascript
    const getIds = (tree: any, results = []) => {

        const iter = results;

        // get current tree's keys to iterate
        Object.keys(tree).forEach(key => {

            // check if current key is __id
            const value = tree[key];
            if(key == "__id")
            {
                iter.push(value);
            }
            // else, check if key value is an object and can be iterated
            else if (typeof value === "object")
            {
                getIds(value, iter);
            }
        });

        return iter;
    };


    const traverseTree = (tree: any) => {

        // get current sub tree1's id and check if exists inside tree2
        
        // const responseTree = markNode(tree2, tree1.__id, tree1.__value);

        // base case: if we reach end of tree, stop traversing
        if(tree.__items.length == 0)
        {
            console.log("id: " + tree.__id + ":    " + tree.name);
            return tree.__id;
        }
        
        // otherwise, print name
        // console.log("id: " + tree1.__id + ":   " + tree1.name);

        // and perform the similar logic for the subtrees of each node
        const response = tree.__items.map((child: any) => {
            return traverseTree(child);
        });



        return response;
    };

    const markNode = (tree: any, id: number, fileValue?: string) => {

        console.log(tree);

        // check if we've found desired node
        if(tree.__id == id)
        {
            var differenceType = "none";

            // check if current node is file 
            if(tree.__isFolder == false)
            {
                // check if JSON __value are equal
                if(tree.__value != fileValue)
                {
                    differenceType = "edited"
                }
            }

            // mark and return found tree with any differences
            tree.__items = {
                ...tree.__items,
                __difference: differenceType
            }

            return tree;
        }

        let currentNode = tree.__items.map((item: any) => {
            return markNode(item, id, fileValue);
        });



        // check if tree was deleted (not found)
        // if (currentNode.length == 0)
        // {
        //     // mark node as deleted
        //     devTree.__items = {
        //         ...devTree.__items,
        //         __difference: "deleted"
        //     }
        // }



        return { ...tree, __items: currentNode };
    };

    return { traverseTree, markNode, getIds};
};

export default useTraverseTree;