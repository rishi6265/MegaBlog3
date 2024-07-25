import { useState } from 'react';
import service from '../appwrite/service';
import {Container} from '../components/index';
import {PostCard} from '../components/index';
function AllPost() {
    const [Posts,setposts]=useState([]);
    service.getallpost([]).then(post=>{

        if(post){
            
            setposts(post.documents)  ;
        }
    }
                )
  return (
    <div className='w-full py-8'>
          <Container>

          <div className='flex flex-wrap'>
          {Posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                    
               
            </div>
          </Container>

    </div>
  )
}

export default AllPost;