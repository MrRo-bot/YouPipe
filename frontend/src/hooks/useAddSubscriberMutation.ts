import { useMutation } from "@tanstack/react-query";

import { usePersistedState } from "./usePersistentStorage";

import customToastFunction from "../utils/Toastify";

import { TokensType } from "../types/types";

const useAddSubscriberMutation = (variableObj: {
  kind: string | undefined;
  id: string | undefined;
}) => {
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
          body: JSON.stringify({
            snippet: {
              resourceId: {
                kind: variableObj.kind,
                channelId: variableObj.id,
              },
            },
          }),
        }
      );
      if (!res.ok)
        throw new Error(`Error ${res.status} in subscribing to user`);
      return res.json();
    },
    onSuccess: async () => {
      customToastFunction("🥳 Subscribed!");
    },
    onError: (e) => {
      customToastFunction(`🤔 ${e.message}`, "error");
    },
  });
};

export default useAddSubscriberMutation;
