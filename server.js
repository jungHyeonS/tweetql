import { ApolloServer,gql } from "apollo-server";
import fetch from "node-fetch"

let tweets = [
    {
        id:"1",
        text:"heelo",
        userId :"2"
    },
    {
        id:"2",
        text:"heelo111",
        userId : "1"
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

    """
    Tweet object repersents a reource for at Tweet
    """
    type Tweet{
        id:ID!
        text:String!
        author:User
    }
    type Query{
        allMovies: [Movie!]!
        allUsers: [User!]!
        allTweets: [Tweet]
        tweet(id: ID!): Tweet,
        ping:String,
        movie(id:String!):Movie
    }

    # user가 데이터를 mutation(변형)하는 type (rest 에 POST)
    type Mutation{
        postTweet(text:String!,userId:ID!): Tweet,
        deleteTweet(id:ID!):Boolean
    }

    type Movie{
        id:Int!
        url:String!
        imdb_code:String!
        title:String!
        title_english:String!
        title_long:String!
        slug:String!
        year:Int!
        rating:Float!
        runtime:Float!
        genres:[String!]!
        summary:String
        description_full:String!
        synopsis:String!
        yt_trailer_code:String!
        language:String!
        background_image:String!
        background_image_original:String!
        small_cover_image:String!
        medium_cover_image:String!
        large_cover_image:String!
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
        },
        allMovies(){
            return fetch("https://yts.mx/api/v2/list_movies.json").then(response => response.json()).then(json => json.data.movies);
        },
        movie(_,{id}){
          const result = fetch(`https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${id}`).then(response => response.json()).then(json => json.data.movie);
          return result
        }
    },
    Mutation:{
        postTweet(_,{text,userId}){
            const isUser = users.findIndex(user => user.id === userId);
            // console.log(isUser);
            if(isUser == -1){
                throw new Error("id must be non-negative");
            }

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
    },
    Tweet:{
        author({userId}){
            return users.find(user => user.id === userId)
        }
    }
}


const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})