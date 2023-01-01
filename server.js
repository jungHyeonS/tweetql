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

//클라이언트가 쿼리를 조회할수있는 데이터 구조를 정의
//Scalar types : String,int 와 같은 내장 타입
const typeDefs = gql`
    type User{
        id:ID!,
        username:String!
        firstName:String!
        lastName:String!
    }
    type Tweet{
        id:ID!
        text:String!
        author:User
    }
    type Query{
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
    }
}


const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})