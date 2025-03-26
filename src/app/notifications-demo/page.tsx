"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Info, AlertTriangle, Ban, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { useNotifications } from '@/context/notification-context';
import Link from 'next/link';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export default function NotificationsDemo() {
  const { addNotification, notifications } = useNotifications();
  const [title, setTitle] = useState('Sample Notification');
  const [message, setMessage] = useState('This is a sample notification message.');
  const [type, setType] = useState<NotificationType>('info');
  const [withLink, setWithLink] = useState(false);
  const [link, setLink] = useState('/procedures');
  const [linkText, setLinkText] = useState('View Procedures');

  const handleAddNotification = () => {
    const notification = {
      title,
      message,
      type,
      ...(withLink && { link, linkText }),
    };

    addNotification(notification);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'warning':
        return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'error':
        return 'border-red-500 bg-red-50 text-red-700';
      default:
        return 'border-blue-500 bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Notification System Demo</CardTitle>
              <CardDescription>
                Test the notification system by creating and sending notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Type</label>
                <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center">
                        <Info className="h-4 w-4 text-blue-500 mr-2" />
                        <span>Information</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Success</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <span>Warning</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="error">
                      <div className="flex items-center">
                        <Ban className="h-4 w-4 text-red-500 mr-2" />
                        <span>Error</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification message"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="withLink"
                  checked={withLink}
                  onChange={(e) => setWithLink(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="withLink" className="text-sm font-medium">
                  Include a link
                </label>
              </div>

              {withLink && (
                <div className="space-y-4 border rounded-md p-3 bg-muted/30">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link URL</label>
                    <Input
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="/procedures"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link Text</label>
                    <Input
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="View details"
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleAddNotification} className="w-full">
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                This is how your notification will look.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`border-l-4 p-4 rounded-md ${getTypeColor(type)}`}>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getTypeIcon(type)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {title || 'Notification Title'}
                    </div>
                    <p className="text-sm mt-1">
                      {message || 'Notification message goes here.'}
                    </p>

                    {withLink && (
                      <div className="flex items-center mt-2 text-sm">
                        <LinkIcon className="h-3 w-3 mr-1" />
                        <span>{linkText || 'View details'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Active Notifications ({notifications.length})</h3>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active notifications.</p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-l-4 p-3 rounded-md text-sm ${
                          notification.read ? 'opacity-70' : ''
                        } ${
                          notification.type === 'success'
                            ? 'border-l-green-500 bg-green-50'
                            : notification.type === 'warning'
                            ? 'border-l-amber-500 bg-amber-50'
                            : notification.type === 'error'
                            ? 'border-l-red-500 bg-red-50'
                            : 'border-l-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs mt-1">{notification.read ? 'Read' : 'Unread'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
