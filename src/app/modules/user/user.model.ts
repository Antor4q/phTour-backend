import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: {type: String, required: true},
    providerId: {type: String, required: true}
},{
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({

    name: {type: String, required: true},
    slug: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String},
   role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
   },
   phone:{type: String},
   address: {type: String},
   picture: {type: String},
   isDeleted: {type: Boolean, default: false},
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isVerified: {type: Boolean, default: false},
   auths: [authProviderSchema],
  
},{
    timestamps: true,
    versionKey: false
})



// slug making pre hook
userSchema.pre("save", async function () {
    
  if (this.name) {
  
    const baseSlug = this.name.toLowerCase().split(" ").join("-")

    let slug = baseSlug;
    let counter = 1;
   
    while (await User.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  
  }
});


// ata update er jnno pre hook
userSchema.pre("findOneAndUpdate", async function(){
//  
 const tour = this.getUpdate() as Partial<IUser>
 
 if(tour.name){
     const baseSlug = tour.name.toLowerCase().split(" ").join("-")

  let slug = `${baseSlug}`
  let counter = 0
  while(await User.exists({slug})){
   slug = `$slug-${counter++}`
  }
  tour.slug = slug
 }
 this.setUpdate(tour)
})

export const User = model<IUser>("User", userSchema);