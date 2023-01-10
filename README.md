# tweetql
GraphQL API Study

## GraphQL
그래프QL은 API를 위한 쿼리 언어입니다, 클라이언트가 필요한것을 정확하게 요청 할수 있는 기능을 제공하며<br/>
시간이 지남에 따라 API를 더 쉽게 발전시키고 강력한 개발자 도구를 활성화합니다

### Graphile
PostgreSQL을 위한 확장 가능한 고성능 자동 GraphQL API 입니다

### Hasura
모든 데이터에 대한 즉각적인 GraphQL<br/>
Hasura는 신규 및 데이터 소스에 대한 즉각적인 GraphQL 및 Rest API를 제공합니다

### GraphQL 이 해결하는 문제점
1. <b>Overfetching</b><br/>
필요한 데이터 보다 더 많은 데이터를 fetch 하는것을 의미합니다<br/>
그래프QL을 사용하면 API에 그래프QL 쿼리를 보내고 필요한것만 정확히 얻을수있으며 항상 예측 가능한 결과를 반환합니다
2. <b>Underfetching</b><br/>
필요한 데이터보다 적은 데이터를 fetch하는것을 말합니다.<br/>
일반적인 RestAPI는 여러 URL에서 로딩해야 하지만<br/>
GraphQL API는 앱에 필요한 모든 데이터를 단일 request로 가져옵니다<br/>
GrpahQL 을 사용하는 앱은 느린 모바일 네트워크 연결에서도 빠를수 있습니다

## Apollo Server
Apollo 서버는 Apollo 클라이언트를 포함한 모든 GraphQL 클라이언트와 호환되는<br/>
오픈소스 GraphQL 서버입니다. 모든 소스의 데이터를 사용할수있는 자체 문서화 기능을 제공합니다

### 설치
```
npm install apollo-server graphql
```

### QueryType
모든 GraphQL 서버는 스키마를 사용하여 클라이언트가 쿼리할수있는 데이터 구조를 정의합니다
```
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
```

### Mutations
GraphQL에 대한 대부분은 데이터 fetching 이지만, 서버측 데이터를 수정할수있는 방법이 필요합니다<br/>
이때 서버측 데이터를 수정하는 모든 작업은 mutation type을 통해 가능합니다
```
# user가 데이터를 mutation(변형)하는 type (rest 에 POST)
type Mutation{
    postTweet(text:String,userId:ID): Tweet,
    deleteTweet(id:ID):Boolean
}
```

### List and Non-Null
느낌표(!)를 추가하여 Non-null를 표시할수있습니다<br/>
Non-null로 표시하게 되면 서버가 항상 이필드에 대해 null이 아닌것을 반환할것을 예상합니다<br/>
그래서 null값을 얻게되면 클라이언트에게 문제가 있음을 알립니다
```
type User{
    id:ID!,
    username:String!
    firstName:String!
    lastName:String!
}
type Tweet{
    id:ID!
    text:String!
    author:User!
}
type Query{
    allTweets: [Tweet]
    tweet(id: ID!): Tweet
}
```

### Resolvers
resolver는 주로 데이터베이스에 엑세스한 다음 데이터를 반환합니다
```
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

    }
}
```

### Resolver arguments
Resolver 함수에는 parent(root),arg,context,info 네가지 인수가 순서대로 전달됩니다
```
//user 데이터의 fullName 필드가 없다면 아래 fullName 함수가 호출된다
User:{
    //다이나믹 필드
    fullName({firstName,lastName}){
        return `${firstName} ${lastName}`
    }
}
```


