const prod_obj_str1 = [
    { filename: "1", entry: "John" },
    { filename: "2", entry: "Jack" },
    { filename: "3", entry: "Sam" },
    { filename: "4", entry: "Bill" },
  ];
const dev_obj_str1 = [
    { filename: "1", entry: "Joseph" },
    { filename: "3", entry: "Sam" },
    { filename: "5", entry: "Bob" },
  ];

// compare objects, find differences - to be mapped and displayedmain.ts(31,31): error TS2345: Argument of type 'string' is not assignable to parameter of type '{ filename: string; entry: string; }'.
const markDifferenceEntries = async(prod_obj_str: string, dev_obj_str: string) => {

    const [prod_obj, dev_obj] = await Promise.all([JSON.parse(prod_obj_str), JSON.parse(dev_obj_str)]);

    // SYNC: loop through and find what exists
    const dev_obj_filenames = dev_obj.map((item: any) => {
       return item.filename 
    });
    const prod_obj_filenames = prod_obj.map((item: any) => {
       return item.filename 
    });
    console.log("dev_obj_filenames: "); console.log(dev_obj_filenames);
    console.log("\n" + "prod_obj_filenames: "); console.log(prod_obj_filenames);

    let newItems: any = [];
    const syncedItems = dev_obj.filter((item: any) => {
        // find filenames that exist in both objs
        if(prod_obj_filenames.indexOf(item.filename) != -1)
            return item;
        else
            // NEW: if item inside dev_obj dne inside of prod_obj => is marked as a new entry
            newItems.push(item);
    });
    console.log("\n" + "syncedItems"); console.log(syncedItems);
    console.log("\n" + "newItems"); console.log(newItems);
    
    // DELETE: loop prod.entry[] and if enrt dne inside of dev.entry[]
    const deletedItems = prod_obj.filter((item: any) => {
        if(!dev_obj_filenames.includes(item.filename))
            return item;
    });
    console.log("\n" + "deletedItems"); console.log(deletedItems);
}

markDifferenceEntries(JSON.stringify(prod_obj_str1), JSON.stringify(dev_obj_str1));