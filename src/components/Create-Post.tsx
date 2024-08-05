import { useMutation } from "@apollo/client";
import { FormEvent, useRef } from "react";
import { CREATE_POST, DELETE_POST } from "../Queries/Queries";
import { Button, Form } from "react-bootstrap";

interface PostFormProps {
    postId?: string; // Optional, in case you want to delete a specific post
}

const PostForm: React.FC<PostFormProps> = ({ postId }) => {
    const [createPost, { data, loading, error }] = useMutation(CREATE_POST);
    const [deletePost] = useMutation(DELETE_POST);

    const inputTitle = useRef<HTMLInputElement>(null);
    const inputBody = useRef<HTMLInputElement>(null);
    const inputUserId = useRef<HTMLInputElement>(null);

    const handleDelete = () => {
        if (postId) {
            deletePost({ variables: { id: postId } }).catch((err) => console.error("Mutation error:", err));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputTitle.current && inputBody.current) {
            createPost({
                variables: {
                    input: {
                        title: inputTitle.current.value,
                        body: inputBody.current.value,
                    }
                },
            }).catch((err) => console.error("Mutation error:", err));
    
            inputTitle.current.value = "";
            inputBody.current.value = "";
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <h1>Create Post</h1>
                <Form.Group controlId='formTitle'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        ref={inputTitle}
                    />
                </Form.Group>
    
                <Form.Group controlId='formBody'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Body"
                        ref={inputBody}
                    />
                </Form.Group>
    
                <Form.Group controlId='formUserId'>
                    <Form.Label>User Id</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter User Id"
                        ref={inputUserId}
                    />
                </Form.Group>
    
                <Button variant="primary" type="submit">
                    Create Post
                </Button>
            </Form>
            {data && data.createPost && (
                <div>
                    <h2>Newly Created Post:</h2>
                    <p>ID: {data.createPost.id}</p>
                    <p>Title: {data.createPost.title}</p>
                    <p>Body: {data.createPost.body}</p>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete Post
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PostForm;
