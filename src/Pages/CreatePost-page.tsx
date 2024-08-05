import { Container } from "react-bootstrap";
import PostForm from "../components/Create-Post";

const CreatePostPage = () => {
    return(
        <Container style={{margin: '20px', padding: '20px', alignContent: 'center'}}>
            <PostForm />
        </Container>
    )
}

export default CreatePostPage;