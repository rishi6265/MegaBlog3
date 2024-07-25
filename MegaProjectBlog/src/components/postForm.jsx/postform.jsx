import React, { useCallback } from "react";

import { Button, Input, RTE, Select } from "../index"

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import service from "../../appwrite/service";
import { useForm } from "react-hook-form";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

 
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        console.log("done");
        if (post) {
            const file = data.image[0]? service.uploadfile(data.image[0]):null;

            if (file) {
                service.delefile(post.featuredimage);
            }

            const dbPost = await service.updatepost(post.$id, {
                ...data,
                featuredimage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await service.uploadfile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                
                data.featuredimage = fileId;
                const dbPost = await service.createpost({ ...data, userid: userData.$id });
                 
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

   const slugTransform=useCallback((value)=>{
    if(value && typeof(value)=="string"){
        return value.trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
   },[])

   React.useEffect(() => {
    // Subscribe to watch changes in the form fields
    const subscription = watch((value, { name }) => {
        // Check if the changed field is "title"
        if (name === "title") {
            // Transform the title into a slug and update the "slug" field
            setValue("slug", slugTransform(value.title), { shouldValidate: true });
        }
    });

    // Clean-up function to unsubscribe from watching form changes
    return () => subscription.unsubscribe();
}, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE  label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}