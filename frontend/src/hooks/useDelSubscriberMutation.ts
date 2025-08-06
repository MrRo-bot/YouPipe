import { useMutation } from "@tanstack/react-query";

import { usePersistedState } from "./usePersistentStorage";

import customToastFunction from "../utils/Toastify";

import { TokensType } from "../types/types";

const useDelSubscriberMutation = () => {
  const [token] = usePersistedState<TokensType>("token", {
    access_token: "",
    refresh_token: "",
    scope: "",
    token_type: "",
    id_token: "",
    expiry_date: 0,
  });

  return useMutation({
    mutationFn: async (id: string | undefined) => {
      const res = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?id=${id}&key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      );
      if (!res.ok && res.status >= 400)
        throw new Error(`Error ${res.status} in removing subscriber`);
    },
    onSuccess: async () => {
      customToastFunction("🥲 Unsubscribed!");
    },
    onError: (e) => {
      customToastFunction(`🤔 ${e.message}`, "error");
    },
  });
};

export default useDelSubscriberMutation;
