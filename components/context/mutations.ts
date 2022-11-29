import { gql } from '@apollo/client'

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = gql`
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`

export const createProfileMutation = gql`
  mutation CreateProfile {
    createProfile(request:{ 
                  handle: "tusharojha",
                  profilePictureUri: "https://www.tusharojha.com/img.jpg",
                  followNFTURI: null, 
                  followModule: {
                       freeFollowModule: true
                    }
                  }) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`
export const getDefaultProfile = gql`
  query DefaultProfile($address: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $address}) {
      id
    }  
  }
`

export const createPost = gql`
  mutation CreatePostTypedData(
    $profile: ProfileId!
    $content: Url!
  ) {
    createPostTypedData(request: {
      profileId: $profile,
      contentURI: $content
      collectModule: {
        revertCollectModule: true
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`