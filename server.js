import { ApolloServer,gql } from "apollo-server";


//클라이언트가 쿼리를 조회할수있는 데이터 구조를 정의
const typeDefs = gql`
    type Query{
         text : String
    }
`

const server = new ApolloServer({typeDefs})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})