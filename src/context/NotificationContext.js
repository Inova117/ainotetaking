"use client"

import { createContext, useContext, useEffect, useState } from "react"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import Constants from "expo-constants"
import { Platform } from "react-native"

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  const registerForPushNotificationsAsync = async () => {
    let token

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!")
        return
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data
    } else {
      alert("Must use physical device for Push Notifications")
    }

    return token
  }

  const scheduleNotification = async (title, body, trigger) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { data: "goes here" },
        },
        trigger,
      })
    } catch (error) {
      console.error("Error scheduling notification:", error)
    }
  }

  const scheduleActionItemReminder = async (actionItem, dueDate) => {
    const trigger = new Date(dueDate)
    trigger.setHours(9, 0, 0) // 9 AM reminder

    await scheduleNotification("Action Item Reminder", `Don't forget: ${actionItem}`, trigger)
  }

  const scheduleWeeklyReview = async () => {
    await scheduleNotification("Weekly Note Review", "Time to review your notes and action items from this week", {
      weekday: 1, // Monday
      hour: 9,
      minute: 0,
      repeats: true,
    })
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        scheduleNotification,
        scheduleActionItemReminder,
        scheduleWeeklyReview,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
