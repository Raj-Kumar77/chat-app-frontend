import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [show,setShow] = useState()
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [pic, setPic] = useState()
  const [loading,setLoading] = useState(false)
  const toast = useToast();
  const navigate = useNavigate()

  const handleClick = () => setShow(!show)

  const postDetails = (pics) =>{
    setLoading(true)
    if(pics === undefined){
        toast({
          title: "Please select an Image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        return
    }
    if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
        const data = new FormData()
        data.append('file',pics)
        data.append('upload_preset','chat-app')
        data.append("cloud_name", "ddbr6k9di");
        axios.post("https://api.cloudinary.com/v1_1/ddbr6k9di/image/upload",data)
        .then((res)=>{
            console.log("Cloudinary response:", res)
            setPic(res.data.url.toString())
            setLoading(false);
            toast({
              title: "Image uploaded successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
        })
        .catch((err)=>{
            console.log('Clourdinary error:',err)
            setLoading(false)
        })
    }else{
        toast({
          title: "Please select an image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        setLoading(false)
        return
    }
  }

  const submitHandler = async() =>{
    setLoading(true)
    if(!name || !email || !password || !confirmPassword){
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        setLoading(false)
        return
    }
    if(password !== confirmPassword){
        toast({
          title: "Passwords Do not match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        return
    }
    try {
        const config = {
            headers:{
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios.post(
          "https://chat-app-backend-theta-ashy.vercel.app/api/user",
          { name, email, password, pic },
          config
        );
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
        localStorage.setItem('userInfo', JSON.stringify(data))
        setLoading(false)
        navigate('/chats')
    } catch (error) {
        toast({
          title: "Error Occured",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button colorScheme="blue" width='100%' style={{marginTop: '15px'}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>

    </VStack>
  );
};

export default Signup;
