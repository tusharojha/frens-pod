import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloLink, HttpLink } from '@apollo/client'
import { Client } from '@wagmi/core';
import { useEffect, useState } from 'react'
import { authenticate, challenge, createPost, createProfileMutation, getDefaultProfile } from './mutations'

const API_URL = 'https://api-mumbai.lens.dev'

const httpLink = new HttpLink({ uri: API_URL });

const useLens = () => {

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  const [accessToken, setToken] = useState<string>()
  const [profileId, setProfileId] = useState<string>()

  const connect = () => {
    const token = sessionStorage.getItem('accessToken')
    if (token != null) {
      console.log(token)
      setToken(token)
      setAuthLink()
      return;
    }

    const client = new ApolloClient({
      uri: API_URL,
      cache: new InMemoryCache()
    })
    setClient(client)
  }

  useEffect(() => {
    connect()
  }, [])

  const setAuthLink = async () => {
    const authLink = new ApolloLink((operation, forward) => {
      const token = sessionStorage.getItem('accessToken')
      operation.setContext({
        headers: {
          'x-access-token': token ? `Bearer ${token}` : '',
        },
      });
    
      return forward(operation);
    });
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
    setClient(client)
  }

  const createProfile = async () => {
    /* authenticate the user */
    const profileData = await client!.mutate({
      mutation: createProfileMutation,
    })
    /* if user authentication is successful, you will receive an accessToken and refreshToken */
    const { data: { txHash } } = profileData
    console.log({ profileData })
  }

  const getProfile = async (address: string) => {
    const profileData = await client!.query({
      query: getDefaultProfile,
      variables: { address }
    })
    const { data: { defaultProfile: { id } } } = profileData
    setProfileId(id)
    console.log({ id })
  }

  const createPod = async (values: any) => {
    if(!profileId) return;
    console.log('ds', profileId)
    const podData = await client!.mutate({
      mutation: createPost,
      variables: { profile: profileId, content: JSON.stringify(values) }
    })
    const { data } = podData
    console.log({ data })
  }

  const login = async (address: string, signer: any) => {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client!.query({
        query: challenge,
        variables: { address }
      })
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await client!.mutate({
        mutation: authenticate,
        variables: {
          address, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken } } } = authData
      console.log({ accessToken })
      setToken(accessToken)
      sessionStorage.setItem('accessToken', accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }

  }

  return { connect, login, client, accessToken, createProfile, setAuthLink, getProfile, createPod }
}

export { useLens }
