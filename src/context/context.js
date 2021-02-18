import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
 const [githubUser, setGithubUser] = useState(mockUser)
 const [githubFollowers, setGithubFollowers] = useState(mockFollowers)
 const [githubRepos, setGithubRepos] = useState(mockRepos)
 const [isLoading, setIsLoading] = useState(false)
 const [request, setRequest] = useState(0)
 //errors

 //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
    .then(({data}) => {
      let {rate: {remaining}} = data
      setRequest(remaining)
      if(remaining === 0){
        //throw an error
      }
      
    })
    .catch((err) => console.log(err))
  }
 useEffect(checkRequests, [])
  return (
    <GithubContext.Provider
      value={{githubUser, githubRepos, githubFollowers, request}}
    >
      {children}
    </GithubContext.Provider>
  )
}
// make sure use
export const useGlobalContext = () => {
  return useContext(GithubContext)
}

export { GithubContext, GithubProvider }
