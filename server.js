import { ApolloServer,gql } from "apollo-server";


//클라이언트가 쿼리를 조회할수있는 데이터 구조를 정의
//Scalar types : String,int 와 같은 내장 타입
const typeDefs = gql`
    type User{
        id:ID,
        username:String
    }
    type Tweet{
        id:ID
        text:String
        author:User
    }
    type Query{
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }

    # user가 데이터를 mutation(변형)하는 type (rest 에 POST)
    type Mutation{
        postTweet(text:String,userId:ID): Tweet,
        deleteTweet(id:ID):Boolean
    }
`

const server = new ApolloServer({typeDefs})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})