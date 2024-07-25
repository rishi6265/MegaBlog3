import React, {useEffect, useState} from 'react'
import { Container } from '../components';
import {PostForm} from '../components/index';

import service from '../appwrite/service';
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null);
    const {slug} = useParams();
    const navigate = useNavigate();
     
useEffect(()=>{

    service.getpost(slug).then(e=>{
        if(e){
            setPosts(e);
        }
        else{
            navigate("/");
        }
    })
},[slug,navigate]);
  return (
    post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
      ) : null
  )}

export default EditPost;