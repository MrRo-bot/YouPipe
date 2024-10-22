export type ErrorTypes = {
  data: string;
  error: {
    columnNumber: number;
    fileName: string;
    lineNumber: number;
    message: string;
    stack: string;
  };
  internal: boolean;
  status: number;
  statusText: string;
};

export type SidebarType = {
  icon: JSX.Element;
  text: string;
};

export type SubscriptionTypes = {
  kind: "youtube#subscription";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    channelId: string;
    thumbnails: {
      key: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: string;
  };
  subscriberSnippet: {
    title: string;
    description: string;
    channelId: string;
    thumbnails: {
      key: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
};

export type SubscriptionListResponseTypes = {
  kind: "youtube#subscriptionListResponse";
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: [SubscriptionTypes];
};

export type ProfileType = {
  issuer: string;
  clientId: string;
  uniqueId: string;
  email: string;
  emailVerified: string;
  name: string;
  picture: string;
  givenName: string;
  familyName: string;
  creationTime: string;
  expiryTime: string;
};

export type DecodedJwtType = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
};
