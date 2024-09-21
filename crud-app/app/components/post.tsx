'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const Post = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // Create a new post
    const handleCreatePost = async () => {
        try {
            const response = await axios.post(API_BASE_URL, {
                userId: 1,
                title: newPostTitle,
                body: newPostBody,
            });
            setPosts([...posts, response.data]);
            setNewPostTitle('');
            setNewPostBody('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    // Update an existing post
    const handleUpdatePost = async () => {
        try {
            if (editingPost) {
                const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${editingPost.id}`, {
                    title: newPostTitle,
                    body: newPostBody,
                });
                const updatedPosts = posts.map((post) =>
                    post.id === editingPost.id ? response.data : post
                );
                setPosts(updatedPosts);
                setEditingPost(null);
                setNewPostTitle('');
                setNewPostBody('');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    // Delete a post
    const handleDeletePost = async (postId: number) => {
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            setPosts(posts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Edit a post
    const handleEditPost = (post: Post) => {
        setNewPostTitle(post.title);
        setNewPostBody(post.body);
        setEditingPost(post);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Posts</h1>

            {/* Create new post section */}
            <div className="mb-4">
                <input
                    type="text"
                    className="border rounded px-3 py-2 mr-2"
                    placeholder="Post title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="Post body"
                    value={newPostBody}
                    onChange={(e) => setNewPostBody(e.target.value)}
                />
                {editingPost ? (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdatePost}
                    >
                        Update
                    </button>
                ) : (
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleCreatePost}
                    >
                        Create
                    </button>
                )}
            </div>

            {/* Display posts */}
            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="mb-2 border p-2 rounded">
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.body}</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                onClick={() => handleEditPost(post)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleDeletePost(post.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Post;