import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";


const divisionSchema = new Schema<IDivision>({
    name: {type: String, required: true, unique: true},
    slug: {type: String, unique: true},
    thumbnail: {type: String},
    description: {type: String}
},{
    timestamps: true
})

// jodi slug ta model and zod a required thakto tahole "save" kaj korbe na tar jnno "validate" use korte hobe
divisionSchema.pre("save", async function () {
  
  if (this.name) {
    // const baseSlug = this.name
    //   .toLowerCase()
    //   .trim()
    //   .replace(/\s+/g, "-");
    const baseSlug = this.name.toLowerCase().split(" ").join("-")

    let slug = baseSlug;
    let counter = 1;

    while (await Division.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
});


// ata update er jnno pre hook
divisionSchema.pre("findOneAndUpdate", async function(){
//  
 const division = this.getUpdate() as Partial<IDivision>
 
 if(division.name){
     const baseSlug = division.name.toLowerCase().split(" ").join("-")

  let slug = `${baseSlug}-division`
  let counter = 0
  while(await Division.exists({slug})){
   slug = `$slug-${counter++}`
  }
  division.slug = slug
 }
 this.setUpdate(division)
})

export const Division = model<IDivision>("Division", divisionSchema)