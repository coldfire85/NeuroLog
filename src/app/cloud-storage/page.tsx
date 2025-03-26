"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CloudCog,
  Database,
  HardDrive,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  FileDown,
  FileUp,
  Info,
  GoogleDrive as GoogleDriveIcon,
  Mail as OneDriveIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  cloudStorageService,
  CloudStorageProvider,
  CloudSyncStatus
} from "@/services/cloud-storage-service";

export default function CloudStoragePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("providers");
  const [storageProvider, setStorageProvider] = useState<CloudStorageProvider>("local");
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>({
    lastSyncTime: null,
    syncInProgress: false,
    error: null,
    totalSynced: 0,
    provider: "local"
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize cloud storage service
  useEffect(() => {
    const initializeService = async () => {
      const initialized = await cloudStorageService.initialize();
      setIsInitialized(initialized);
      if (initialized) {
        const config = cloudStorageService.getConfiguration();
        if (config) {
          setStorageProvider(config.provider);
        }
        const status = cloudStorageService.getSyncStatus();
        setSyncStatus(status);
      }
    };

    initializeService();
  }, []);

  // Handle connecting to Google Drive
  const handleConnectGoogleDrive = async () => {
    // In a real app, this would open OAuth flow with Google
    setIsSyncing(true);
    try {
      // Mock OAuth code for demo
      const mockAuthCode = "mock-google-auth-code";
      const success = await cloudStorageService.connectToGoogleDrive(mockAuthCode);

      if (success) {
        setStorageProvider("google-drive");
        const status = cloudStorageService.getSyncStatus();
        setSyncStatus(status);

        toast({
          title: "Connected to Google Drive",
          description: "Your data will now be stored in your Google Drive account",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Google Drive. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google Drive connection failed:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle connecting to OneDrive
  const handleConnectOneDrive = async () => {
    // In a real app, this would open OAuth flow with Microsoft
    setIsSyncing(true);
    try {
      // Mock OAuth code for demo
      const mockAuthCode = "mock-onedrive-auth-code";
      const success = await cloudStorageService.connectToOneDrive(mockAuthCode);

      if (success) {
        setStorageProvider("onedrive");
        const status = cloudStorageService.getSyncStatus();
        setSyncStatus(status);

        toast({
          title: "Connected to OneDrive",
          description: "Your data will now be stored in your OneDrive account",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to OneDrive. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OneDrive connection failed:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle disconnecting from cloud storage
  const handleDisconnect = () => {
    cloudStorageService.clearConfiguration();
    setStorageProvider("local");
    setSyncStatus({
      lastSyncTime: null,
      syncInProgress: false,
      error: null,
      totalSynced: 0,
      provider: "local"
    });

    toast({
      title: "Disconnected",
      description: "Your data will now be stored locally on your device",
    });
  };

  // Handle manual sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const success = await cloudStorageService.fullSync();
      if (success) {
        const status = cloudStorageService.getSyncStatus();
        setSyncStatus(status);

        toast({
          title: "Sync Completed",
          description: `Successfully synced ${status.totalSynced} items`,
        });
      } else {
        toast({
          title: "Sync Failed",
          description: "Could not sync your data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        title: "Sync Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text inline-block">
          Cloud Storage Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Configure where your neurosurgical data is stored and how it's synchronized
        </p>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Your Data, Your Control</AlertTitle>
          <AlertDescription>
            NeuroLog can store all your data directly in your personal cloud storage account
            (Google Drive or OneDrive). This means your data stays private and under your control
            at all times. We never store your sensitive medical data on our servers.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="providers">Storage Providers</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="providers">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
              {/* Google Drive Option */}
              <Card className={storageProvider === "google-drive" ? "border-2 border-blue-500 dark:border-blue-400" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <span className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-2">
                        <GoogleDriveIcon className="h-5 w-5 text-red-500" />
                      </span>
                      Google Drive
                    </CardTitle>
                    {storageProvider === "google-drive" && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Store your data in your personal Google Drive account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Privacy</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Free Storage</span>
                      <span>15 GB</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Access Anywhere</span>
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {storageProvider === "google-drive" ? (
                    <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                      <X className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleConnectGoogleDrive} disabled={isSyncing}>
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* OneDrive Option */}
              <Card className={storageProvider === "onedrive" ? "border-2 border-blue-500 dark:border-blue-400" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-2">
                        <OneDriveIcon className="h-5 w-5 text-blue-500" />
                      </span>
                      Microsoft OneDrive
                    </CardTitle>
                    {storageProvider === "onedrive" && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Store your data in your personal OneDrive account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Privacy</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Free Storage</span>
                      <span>5 GB</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Access Anywhere</span>
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {storageProvider === "onedrive" ? (
                    <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                      <X className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleConnectOneDrive} disabled={isSyncing}>
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Local Storage Option */}
              <Card className={storageProvider === "local" ? "border-2 border-blue-500 dark:border-blue-400 md:col-span-2" : "md:col-span-2"}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <span className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-2">
                        <HardDrive className="h-5 w-5 text-gray-500" />
                      </span>
                      Local Storage
                    </CardTitle>
                    {storageProvider === "local" && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Store your data locally in your browser (no cloud sync)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Privacy</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Storage Space</span>
                      <span>Limited by browser</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Multi-device Access</span>
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                      <span>Backup Protection</span>
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                  </div>

                  <Alert className="mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-300 text-xs">
                      Warning: Local storage can be lost if you clear your browser data. For better data security,
                      we recommend connecting to a cloud storage provider.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  {storageProvider !== "local" ? (
                    <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                      <HardDrive className="h-4 w-4 mr-2" />
                      Switch to Local Storage
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      <Check className="h-4 w-4 mr-2" />
                      Currently Using Local Storage
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Settings</CardTitle>
                <CardDescription>
                  Configure how your data syncs with your cloud storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {storageProvider === "local" ? (
                  <Alert className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      You are currently using local storage. Connect to a cloud provider to enable syncing.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Auto-Sync</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Automatically sync changes to {storageProvider === "google-drive" ? "Google Drive" : "OneDrive"}
                          </p>
                        </div>
                        <Switch
                          checked={autoSync}
                          onCheckedChange={setAutoSync}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sync Status</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Last Synced:</span>
                            <span>
                              {syncStatus.lastSyncTime
                                ? syncStatus.lastSyncTime.toLocaleString()
                                : "Never"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Items Synced:</span>
                            <span>{syncStatus.totalSynced}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Provider:</span>
                            <span className="capitalize">{syncStatus.provider.replace("-", " ")}</span>
                          </div>
                          {syncStatus.error && (
                            <div className="text-sm text-red-500 mt-2">
                              <AlertCircle className="h-3 w-3 inline-block mr-1" />
                              {syncStatus.error}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="default"
                          onClick={handleManualSync}
                          disabled={isSyncing}
                          className="flex-1"
                        >
                          {isSyncing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </>
                          )}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <FileDown className="h-4 w-4 mr-2" />
                          Export Backup
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
