import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";


const tourTypeSchema = new Schema<ITourType>({
 name: {type:String, required: true, unique: true},
 slug: {type:String}
},{
    timestamps: true
})



const tourSchema = new Schema<ITour>({
    title: {type: String, required: true},
    slug: {type: String, unique: true},
    description: {type: String},
    images: {type: [String],default: []},
    location: {type: String},
    costFrom: {type: Number},
    startDate: {type: Date},
    endDate: {type: Date},
    departureLocation: {type: String},
    arrivalLocation: {type: String},
    included: {type: [String], default:[]},
    excluded: {type: [String], default:[]},
    amenities: {type: [String], default:[]},
    tourPlan : {type: [String], default:[]},
    maxGuest: {type: Number},
    minAge: {type: Number},
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }
},{
    timestamps: true
})

// jodi slug ta model and zod a required thakto tahole "save" kaj korbe na tar jnno "validate" use korte hobe
tourSchema.pre("save", async function () {
    
  if (this.title) {
    // const baseSlug = this.title
    //   .toLowerCase()
    //   .trim()
    //   .replace(/\s+/g, "-");
    const baseSlug = this.title.toLowerCase().split(" ").join("-")

    let slug = baseSlug;
    let counter = 1;

    while (await Tour.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
});
tourTypeSchema.pre("save", async function () {
    
  if (this.name) {
  
    const baseSlug = this.name.toLowerCase().split(" ").join("-")

    let slug = baseSlug;
    let counter = 1;
   
    while (await TourType.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  
  }
});


// ata update er jnno pre hook
tourSchema.pre("findOneAndUpdate", async function(){
//  
 const tour = this.getUpdate() as Partial<ITour>
 
 if(tour.title){
     const baseSlug = tour.title.toLowerCase().split(" ").join("-")

  let slug = `${baseSlug}-tour`
  let counter = 0
  while(await Tour.exists({slug})){
   slug = `$slug-${counter++}`
  }
  tour.slug = slug
 }
 this.setUpdate(tour)
})
tourTypeSchema.pre("findOneAndUpdate", async function(){
//  
 const tourType = this.getUpdate() as Partial<ITourType>
 
 if(tourType.name){
     const baseSlug = tourType.name.toLowerCase().split(" ").join("-")

  let slug = `${baseSlug}-tourType`
  let counter = 0
  while(await TourType.exists({slug})){
   slug = `$slug-${counter++}`
  }
  tourType.slug = slug
 }
 this.setUpdate(tourType)
})

export const Tour = model<ITour>("Tour", tourSchema)
export const TourType = model<ITourType>("TourType", tourTypeSchema)