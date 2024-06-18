require("dotenv").config();
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("./../../api/index");
const Blog = require("./../../api/models/Blog");
const User = require("./../../api/models/User");

// Sample blog data for testing
const testBlog = {
  title: "Test Blog",
  content: "This is a test blog post.",
};

let testBlogId; // To store the ID of the blog created during testing
let authToken; // To store the JWT token for authorization

// Helper function to create a new user and generate JWT token
const createUserAndLogin = async () => {
  const userData = {
    name: "testuser",
    email: "testuser@example.com",
    password: "password123",
  };

  // Create a new user
  const user = await User.create(userData);

  // Generate JWT token
  authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return user;
};

// Hook to run before tests start
beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create and authenticate a test user
  await createUserAndLogin();
});

// Hook to run after tests finish
afterAll(async () => {
  // Clean up and disconnect from the database
  await mongoose.connection.close();
});
console.log("AUth: ", authToken)
describe("Blog CRUD Operations", () => {
  // Test case: Create a new blog post
  it("should create a new blog post", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(testBlog)
      .expect(201);

    // Store the created blog ID for use in other tests
    testBlogId = res.body._id;

    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(testBlog.title);
  });

  // Test case: Fetch the newly created blog post
  it("should fetch the newly created blog post", async () => {
    const res = await request(app)
      .get(`/api/blogs/${testBlogId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.title).toBe(testBlog.title);
    expect(res.body.content).toBe(testBlog.content);
  });

  // Test case: Update an existing blog post
  it("should update the existing blog post", async () => {
    const updatedBlog = {
      title: "Updated Test Blog",
      content: "This is an updated test blog post.",
    };

    const res = await request(app)
      .put(`/api/blogs/${testBlogId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedBlog)
      .expect(200);

    expect(res.body.title).toBe(updatedBlog.title);
    expect(res.body.content).toBe(updatedBlog.content);
  });

  // Test case: Delete a blog post
  it("should delete the blog post", async () => {
    await request(app)
      .delete(`/api/blogs/${testBlogId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    // Verify the blog post is deleted
    const deletedBlog = await Blog.findById(testBlogId);
    expect(deletedBlog).toBeNull();
  });
});
