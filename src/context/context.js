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
 const [error, setError] = useState({show: false, msg: ''})
 //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
    .then(({data}) => {
      let {rate: {remaining}} = data
      setRequest(remaining)
      if(remaining === 0){
        //throw an error
        toggleError(true, 'sorry, you have exceeded your hourly rate limit!!')
      }
      
    })
    .catch((err) => console.log(err))
  }

  function toggleError(show = false, msg='') {
      setError({show, msg})
  }

  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`)
                      .catch((err) =>console.log(err))
    if(response){
      setGithubUser(response.data)
      const {login, followers_url} = response.data
      //repos
      axios(`${rootUrl}/users/${login}/repos?per_page=100`)
      .then(response => setGithubRepos(response.data))
      //followers
      axios(`${followers_url}?per_page=100`).then((response) =>
        setGithubFollowers(response.data)
      )
    }else{
      toggleError(true, 'there is no user with that username')
    }
    checkRequests()
    setIsLoading(false)
  }
 useEffect(checkRequests, [])
  return (
    <GithubContext.Provider
      value={{githubUser, githubRepos, githubFollowers, request, error, searchGithubUser, isLoading}}
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
