exports.typeDefs = `

input NoteInput{
    title : String, 
    content : String
}

type Note {
    id : ID!,
    title : String!, 
    content : String, 
    createdAt : String
    user : String!
}

type User{
    id : ID!, 
    name : String!,
    email : String!, 
    password : String
}

type AuthPayload {
    token : String, 
    user : User
}

type Query {
    note(id: String!): Note,
    noteTitle(userId : String!, title : String!) : Note,
    notes: [Note], 

    user : User,
}

type Mutation{
    createNote(title : String!, content : String!) : Note!
    updateNote(id : ID!, fields : NoteInput!) : Note!
    deleteNote(id : ID!) : Note!

    signup(name : String!, email : String!, password : String!) : AuthPayload   
    login(email : String!, password : String!) : AuthPayload
  }
`;
