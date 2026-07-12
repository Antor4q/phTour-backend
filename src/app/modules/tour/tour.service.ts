/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query } from "mongoose";
import { excludeField } from "../../contants";
import { tourSearchableFields } from "./tour.consenst";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/queryBuilder";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const tour = await Tour.create(payload)
 
    return tour;
};



const getAllTours = async (query: Record<string, string>) => {
   
    const queryBuilder = new QueryBuilder(Tour.find(), query)
    const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    
  
//    const meta = await queryBuilder.getMeta()
   const [data,meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta()
   ])
 
    return {
        data,
        meta
    }
};
// const getAllTours = async (query: Record<string, string>) => {
   
//   const filter = query
//   const search = query.search || ""
//   const sort = query.sort || "-createdAt"
//   const fields = query.fields?.split(",").join(" ") || "";
// //   pagination
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit

  
//   for(const field of excludeField){
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field]
//   }

//   const searchQuery = {
//     $or: tourSearchableFields.map(field =>({[field]: {$regex: search, $options:"i"}}))
//   }

// //   pagination skip and limit


//     // const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)
//  const filterQuery = Tour.find(filter)
//  const tours = filterQuery.find(searchQuery)
//  const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)

//     const totalTours = await Tour.countDocuments();
//     const totalPage = Math.ceil(totalTours / limit)

//     // meta data
//     const meta = {
//         page: page,
//         limit:limit,
//         totalPage:totalPage,
//         total:totalTours
//     }
   

//     return {
//         data : allTours,
//         meta : meta
//     }
// };
// const getAllToursCommented = async (query: Record<string, string>) => {
//     // filters, search, sorting start from here query
//     // filter er $options: "i" er mane holo je lowercase korbe ---- ekhon search amon hote pare title er opore na hoia locaiton or date er opore tokhon ei fiedl gola dynamic korte hobe tar jnno
//   const filter = query
//   const search = query.search || ""
//   const sort = query.sort || "-createdAt"
// const fields = query.fields.split(",").join(" ") || "" jodi ekbar besi fields cau tahole aivave dite hobe first coma remove kore then space hobe -- fields filtering
// //   ei delte er karon holo jkhon ami filter and search ek sthe korte jamo tokon filter a jei field thakbe exact match korbe search to field nai oitao match korar try korbe exact then data asbe na
// //   delete filter["search"]
// //   delete filter["sort"] atar version is for loop
//   const excludeField = ["search", "sort"]
//   for(const field of excludeField){
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field]
//   }
// //   const searchArray = tourSearchableFields.map(field =>({field: {$regex: search, $options:"i"}}))
//   const searchQuery = {
//     $or: tourSearchableFields.map(field =>({[field]: {$regex: search, $options:"i"}}))
//   }

//     // const tours = await Tour.find({
//     //     title: {$regex: search, $options:"i"} single search
//     //     multiple field search
//     //     $or: searchArray
//     // })
//     const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields)
// aikhane .select er modhe title ata dara sodho title field er data gola dibe
//     const totalTours = await Tour.countDocuments();
   

//     return {
//         data : tours,
//         meta : {
//             total: totalTours
//         }
//     }
// };



const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}` // dhaka-division-2
    //     }

    //     payload.slug = slug
    // }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};

const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create(payload);
};
const getAllTourTypes = async () => {
    return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};
const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};


export const TourService = {
   
   createTour,
    createTourType,
    getAllTourTypes,
    deleteTourType,
    updateTourType,
    getAllTours,
    updateTour,
    deleteTour,
  
};
