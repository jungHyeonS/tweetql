import { ApolloServer,gql } from "apollo-server";


let tweets = [
    {
        id:"1",
        text:"heelo",
    },
    {
        id:"2",
        text:"heelo111",
    }
]

let users = [
    {
        id : '1',
        firstName : "nico",
        lastName : 'aaa'
    },
    {
        id:"2",
        firstName : "abc",
        lastName : "abc"
    }
]

//클라이언트가 쿼리를 조회할수있는 데이터 구조를 정의
//Scalar types : String,int 와 같은 내장 타입
const typeDefs = gql`
    type User{
        id:ID!,
        firstName:String!
        lastName:String!
        fullName:String!
    }
    type Tweet{
        id:ID!
        text:String!
        author:User
    }
    type Query{
        allUsers: [User!]!
        allTweets: [Tweet]
        tweet(id: ID!): Tweet,
        ping:String
    }

    # user가 데이터를 mutation(변형)하는 type (rest 에 POST)
    type Mutation{
        postTweet(text:String!,userId:ID!): Tweet,
        deleteTweet(id:ID!):Boolean
    }
`


const resolvers = {
    Query : {
        tweet(root,{id}){
            return tweets.find(tweet => tweet.id === id);
        },
        ping(){
            return 'poong'
        },
        allTweets(){
            return tweets
        },
        allUsers(){
            return users
        }
    },
    Mutation:{
        postTweet(_,{text,userId}){
            const newTweet = {
                id : tweets.length + 1,
                text,
            }
            tweets.push(newTweet)
            return newTweet
        },
        deleteTweet(_,{id}){
            const tweet = tweets.find(tweet => tweet.id === id)
            if(!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id)
            return true;
        }
    },

    //user 데이터의 fullName 필드가 없다면 아래 fullName 함수가 호출된다
    User:{
        //다이나믹 필드
        fullName({firstName,lastName}){
            return `${firstName} ${lastName}`
        }
    }
}


const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})