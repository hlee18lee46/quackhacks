using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class PuppyChatManager : MonoBehaviour
{
    [Header("Backend")]
    public string baseUrl = "https://quackhacks.vercel.app";

    [Header("User")]
    public string userId = "user123";
    public string petName = "Bori";
    public float walkDistanceMiles = 2f;
    public string petMood = "happy";

    [Header("UI")]
    public GameObject chatPanel;
    public TMP_InputField messageInput;
    public TMP_Text chatText;
    public Button sendButton;
    public Button closeButton;

    private string threadId = "";

    void Start()
    {
        sendButton.onClick.AddListener(SendMessage);
        closeButton.onClick.AddListener(CloseChat);

        chatPanel.SetActive(true);
        chatText.text = "Bori: Hi! I missed you. Want to talk?";
    }

    public void SendMessage()
    {
        string message = messageInput.text.Trim();

        if (string.IsNullOrEmpty(message))
            return;

        chatText.text += "\n\nYou: " + message;
        messageInput.text = "";

        StartCoroutine(SendChatRequest(message));
    }

    IEnumerator SendChatRequest(string message)
    {
        chatText.text += "\nBori: thinking...";

        PuppyBrainRequest body = new PuppyBrainRequest
        {
            userId = userId,
            message = message,
            petName = petName,
            walkDistanceMiles = walkDistanceMiles,
            petMood = petMood,
            threadId = threadId
        };

        string json = JsonUtility.ToJson(body);

        UnityWebRequest request =
            new UnityWebRequest(baseUrl + "/api/chat/gradient-backboard", "POST");

        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        chatText.text = chatText.text.Replace("\nBori: thinking...", "");

        Debug.Log("Puppy Chat Status: " + request.responseCode);
        Debug.Log("Puppy Chat Response: " + request.downloadHandler.text);

        if (request.result != UnityWebRequest.Result.Success)
        {
            chatText.text += "\nBori: Sorry, I could not connect.";
            Debug.LogError(request.error);
            yield break;
        }

        PuppyBrainResponse response =
            JsonUtility.FromJson<PuppyBrainResponse>(request.downloadHandler.text);

        if (response != null && response.success)
        {
            threadId = response.threadId;

            string reply = !string.IsNullOrEmpty(response.reply)
                ? response.reply
                : response.aiResponse;

            chatText.text += "\nBori: " + reply;
        }
        else
        {
            chatText.text += "\nBori: Something went wrong.";
        }
    }

    public void CloseChat()
    {
        chatPanel.SetActive(false);
    }
}

[System.Serializable]
public class PuppyBrainRequest
{
    public string userId;
    public string message;
    public string petName;
    public float walkDistanceMiles;
    public string petMood;
    public string threadId;
}

[System.Serializable]
public class PuppyBrainResponse
{
    public bool success;
    public string reply;
    public string aiResponse;
    public string threadId;
}