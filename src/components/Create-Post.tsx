import { useQuery, useMutation } from "@apollo/client";
import { FormEvent, useRef, useState } from "react";
import { CREATE_POST, DELETE_POST, GET_ALL_POSTS, UPDATE_POST } from "../Queries/Queries";
import { Button, Form } from "react-bootstrap";

interface PostFormProps {
  postId?: string;
}

const PostForm: React.FC<PostFormProps> = ({ postId }) => {
  const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GET_ALL_POSTS);
  const [createPost, { data: createData, loading: createLoading, error: createError }] = useMutation(CREATE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [updatePost] = useMutation(UPDATE_POST);

  const inputTitle = useRef<HTMLInputElement>(null);
  const inputBody = useRef<HTMLInputElement>(null);
  const inputUserId = useRef<HTMLInputElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deletePost({
      variables: { id },
      update: (cache) => {
        const existingPosts = cache.readQuery({ query: GET_ALL_POSTS });
        const newPosts = existingPosts.posts.data.filter((post: any) => post.id !== id);

        cache.writeQuery({
          query: GET_ALL_POSTS,
          data: {
            posts: {
              ...existingPosts.posts,
              data: newPosts,
            },
          },
        });
      },
    }).catch((err) => console.error("Mutation error:", err));
  };

  const handleUpdate = (id: string, title: string, body: string) => {
    updatePost({
      variables: {
        id,
        input: {
          title,
          body,
        },
      },
    }).catch((err) => console.error("Mutation error:", err));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputTitle.current && inputBody.current) {
      createPost({
        variables: {
          input: {
            title: inputTitle.current.value,
            body: inputBody.current.value,
          },
        },
        refetchQueries: [{ query: GET_ALL_POSTS }],
      }).catch((err) => console.error("Mutation error:", err));

      inputTitle.current.value = "";
      inputBody.current.value = "";
    }
  };

  const handleEditClick = (post: any) => {
    inputTitle.current!.value = post.title;
    inputBody.current!.value = post.body;
    setEditingPostId(post.id);
  };

  if (postsLoading || createLoading) return <p>Loading...</p>;
  if (postsError || createError) return <p>Error: {postsError?.message || createError?.message}</p>;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <h1>{editingPostId ? "Update Post" : "Create Post"}</h1>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter Title" ref={inputTitle} />
        </Form.Group>

        <Form.Group controlId="formBody">
          <Form.Label>Body</Form.Label>
          <Form.Control type="text" placeholder="Enter Body" ref={inputBody} />
        </Form.Group>

        <Form.Group controlId="formUserId">
          <Form.Label>User Id</Form.Label>
          <Form.Control type="text" placeholder="Enter User Id" ref={inputUserId} />
        </Form.Group>

        <Button
  variant="primary"
  type="button"
  onClick={(e: FormEvent) => {
    if (editingPostId) {
      handleUpdate(editingPostId, inputTitle.current!.value, inputBody.current!.value);
    } else {
      handleSubmit(e);  
    }
  }}
>
  {editingPostId ? "Update Post" : "Create Post"}
</Button>
      </Form>

      {createData && createData.createPost && (
        <div>
          <h2>Newly Created Post:</h2>
          <p>ID: {createData.createPost.id}</p>
          <p>Title: {createData.createPost.title}</p>
          <p>Body: {createData.createPost.body}</p>
        </div>
      )}

      <h2>All Posts</h2>
      {postsData?.posts?.data.map((post: any) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <p>User ID: {post.user.id}</p>
          <Button variant="danger" onClick={() => handleDelete(post.id)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => handleEditClick(post)}>
            Edit
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PostForm;
