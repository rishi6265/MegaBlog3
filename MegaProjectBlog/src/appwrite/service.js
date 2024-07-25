import Config from "../config/config";
import { Client,ID,Databases,Storage, Query } from "appwrite";

export class Service{
client=new Client();
database
bucket

constructor(){
    this.client.setEndpoint(Config.appwriteurl).setProject((Config.appwriteprojectid));
    this.database=new Databases(this.client);
    this.bucket=new Storage(this.client);
}

async createpost({title,slug,content,featuredimage,status,userid}){
    try {
       return await this.database.createDocument(
    Config.appwritedatabaseid,
    Config.appwritecollectionid,
    slug,
    {
        title,
        content,
        featuredimage,
        status,
        userid
    }
       )
    } catch (error) {
       throw console.log(error);
    }
}

async updatepost({title,slug,content,featuredimage,status}){
    try {
        return await this.database.updateDocument(
            Config.appwritedatabaseid,
            Config.appwritecollectionid,
            slug,
            {
                title,
                content,
                featuredimage,
                status,
            }
        )
    } catch (error) {
       throw console.log(error);
    }
}
async deletepost(slug){
    try {
        await this.database.deleteDocument(
            Config.appwritedatabaseid,
            Config.appwritecollectionid,
            slug
        
        )
        return true
    } catch (error) {
        console.log("Appwrite serive :: deletePost :: error", error);
        return false
    }
}


async getpost(slug){
    try {
    return  await this.database.getDocument(
            Config.appwritedatabaseid,
            Config.appwritecollectionid,
            slug,
           
        )
      

    } catch (error) {
       throw console.log(error);
    return false;
    }
}
async getallpost(query= [Query.equal("status", "active")]){
    try {
    return  await this.database.listDocuments(
            Config.appwritedatabaseid,
            Config.appwritecollectionid,
            query,
           
        )
      

    } 
    catch (error) {
       throw console.log(error);
    return false;
    }
}
//file upload

async uploadfile(file){
try {
  return await this.bucket.createFile(
    Config.appwritebucketid,
     ID.unique(),
     file
  )   
} catch (error) {
   throw console.log(error);
}
}
async delefile(fileid){
    try {
        await this.bucket.deleteFile(
                Config.appwritebucketid,
            fileid,
        )
        return true
    } catch (error) {
        throw error;
        return false;
    }
}

getFilePreview(fileid){
    return this.bucket.getFilePreview(
        Config.appwritebucketid,
        fileid
    )
}

}

const service=new Service();
export default service;