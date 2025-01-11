"use client";

import React, { Suspense, useState, useEffect } from "react";
import PanelSidebar from "@/components/PanelSidebar";
import LoadingScreen from "@/components/Loading";
import { auth, firestore } from "@util/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc, collection } from "firebase/firestore";
import { FaEye } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// react router

const Credentials: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [visibleKeyIndex, setVisibleKeyIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
        fetchApiKeys(user);
      } else {
        console.log("No user is authenticated.");
        location.href = "/account/login";
      }
    });

    return () => unsubscribe();
  }, []);

  const openDialog = async () => {
    auth.currentUser
      ?.getIdToken(true)
      .then((FB_AuthToken) => {
        setAuthToken(FB_AuthToken);
        console.log(FB_AuthToken);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching auth token:", error);
      });
  };

  const fetchApiKeys = async (user: any) => {
    const apiKeysCollection = collection(firestore, "rai-api-key");
    const docRef = doc(apiKeysCollection, user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setApiKeys(docSnap.data().apiKeys || []);
    } else {
      console.log("No such document!");
    }
    setLoading(false);
  };

  const createApiKey = async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      const response = await fetch("https://api.raic.dev/v1/key/create", {
        method: "POST",
        headers: {
          Authorization: idToken,
        },
      });
      const data = await response.json();
      if (data.apiKey) {
        const docRef = doc(firestore, "rai-api-key", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, { apiKeys: [] });
        }
        await updateDoc(docRef, {
          apiKeys: arrayUnion(data.apiKey),
        });
        setApiKeys((prevKeys) => [...prevKeys, data.apiKey]);
        toast({
          title: "作成しました",
          description: "API キーの作成に成功しました",
        });
      } else {
        toast({
          title: "失敗しました",
          description: "API キーの作成に失敗しました",
          variant: "destructive",
        });
      }
    }
  };

  const deleteApiKey = async (key: string) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      console.log(key);
      const response = await fetch("https://api.raic.dev/v1/key/delete", {
        method: "POST",
        headers: {
          Authorization: idToken,
          "X-ApiKey": key,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        const docRef = doc(firestore, "rai-api-key", user.uid);
        await updateDoc(docRef, {
          apiKeys: arrayRemove(key),
        });
        setApiKeys((prevKeys) => prevKeys.filter((k) => k !== key));
        toast({
          title: "削除しました",
          description: "API キーの削除に成功しました",
        });
      } else {
        toast({
          title: "削除に失敗しました",
          description: "API キーの削除に失敗しました",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <SidebarProvider className="mt-8">
      <div className="min-h-screen w-full flex flex-col lg:flex-row p-4 lg:p-8">
        <Suspense fallback={<LoadingScreen />}>
          <PanelSidebar />
          <div className="flex-grow w-full p-4 lg:p-8 h-full lg:h-screen ml-0 lg:ml-4">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">API キーの管理</h1>
            <p className="text-lg lg:text-xl mb-8 max-w-5xl">API から使用できるキーの管理</p>

            <h2 className="text-2xl lg:text-3xl font-bold mb-5">API キーを作成する</h2>
            <Button onClick={createApiKey} className="mr-2">
              API キーを作成
            </Button>

            <Button variant={"destructive"} onClick={openDialog}>
              Firebase の Auth Token を発行
            </Button>

            <div className="mt-8">
              {loading ? (
                <p>ロード中...</p>
              ) : (
                apiKeys.map((key, index) => (
                  <div key={index} className="p-4 rounded bg-sidebar-accent mb-4 flex justify-between items-center">
                    <span>API キー {index + 1}</span>
                    <div className="flex items-center">
                      {visibleKeyIndex === index && <span className="mr-4">{key}</span>}
                      <Button size="icon" onClick={() => setVisibleKeyIndex(visibleKeyIndex === index ? null : index)} className="mr-4" title="APIキーを表示">
                        <FaEye className="h-6 w-6 " />
                      </Button>
                      <Button size="icon" variant={"destructive"} onClick={() => deleteApiKey(key)} title="APIキーを削除">
                        <FaTrash className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Toaster />
          </div>

          <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Firebase の認証トークンを発行しました</AlertDialogTitle>
                <AlertDialogDescription>これらのトークンは、アカウントが盗まれる可能性があるため他人には公開しないでください。</AlertDialogDescription>
              </AlertDialogHeader>
              <Label className="text-muted-foreground" htmlFor="authToken">
                認証トークン
              </Label>
              <Popover open={popoverOpen}>
                <PopoverContent>
                  <span>Copied</span>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Input
                    type="text"
                    id="authToken"
                    value={authToken}
                    readOnly
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      navigator.clipboard.writeText(authToken!);
                      setPopoverOpen(true);

                      setTimeout(() => {
                        setPopoverOpen(false);
                      }, 1000);
                    }}
                  />
                </PopoverTrigger>
              </Popover>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsDialogOpen(false)}>閉じる</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Credentials;
