using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public class WalkieApiClient : MonoBehaviour
{
    [Header("Backend")]
    public string baseUrl = "https://quackhacks.vercel.app";

    [Header("User")]
    public string userId = "user123";
    public string petName = "Bori";

    [Header("Thread Memory")]
    public string threadId = "";

    public void SaveWalk(
        float distanceMiles,
        float durationMinutes,
        string locationName,
        string petMood
    )
    {
        StartCoroutine(
            SaveWalkCoroutine(
                distanceMiles,
                durationMinutes,
                locationName,
                petMood
            )
        );
    }

    public void AskPuppy(
        string message,
        float walkDistanceMiles,
        string petMood
    )
    {
        StartCoroutine(
            AskPuppyCoroutine(
                message,
                walkDistanceMiles,
                petMood
            )
        );
    }

    public void GetInsights()
    {
        StartCoroutine(GetInsightsCoroutine());
    }

    IEnumerator SaveWalkCoroutine(
        float distanceMiles,
        float durationMinutes,
        string locationName,
        string petMood
    )
    {
        WalkRequest requestBody = new WalkRequest
        {
            userId = userId,
            petName = petName,
            distanceMiles = distanceMiles,
            durationMinutes = durationMinutes,
            locationName = locationName,
            petMood = petMood
        };

        string json = JsonUtility.ToJson(requestBody);

        yield return PostJson(
            "/api/walks/snowflake",
            json
        );
    }

    IEnumerator AskPuppyCoroutine(
        string message,
        float walkDistanceMiles,
        string petMood
    )
    {
        ChatRequest requestBody = new ChatRequest
        {
            userId = userId,
            petName = petName,
            message = message,
            walkDistanceMiles = walkDistanceMiles,
            petMood = petMood,
            threadId = threadId
        };

        string json = JsonUtility.ToJson(requestBody);

        string url =
            baseUrl +
            "/api/chat/gradient-backboard";

        UnityWebRequest request =
            new UnityWebRequest(url, "POST");

        byte[] bodyRaw =
            Encoding.UTF8.GetBytes(json);

        request.uploadHandler =
            new UploadHandlerRaw(bodyRaw);

        request.downloadHandler =
            new DownloadHandlerBuffer();

        request.SetRequestHeader(
            "Content-Type",
            "application/json"
        );

        yield return request.SendWebRequest();

        if (
            request.result !=
            UnityWebRequest.Result.Success
        )
        {
            Debug.LogError(
                "Chat Error: " + request.error
            );

            Debug.LogError(
                request.downloadHandler.text
            );

            yield break;
        }

        string responseJson =
            request.downloadHandler.text;

        Debug.Log(
            "Chat Response: " +
            responseJson
        );

        ChatResponse response =
            JsonUtility.FromJson<ChatResponse>(
                responseJson
            );

        if (
            response != null &&
            !string.IsNullOrEmpty(
                response.threadId
            )
        )
        {
            threadId = response.threadId;

            Debug.Log(
                "Saved Thread ID: " +
                threadId
            );
        }
    }

    IEnumerator GetInsightsCoroutine()
    {
        InsightRequest requestBody =
            new InsightRequest
            {
                userId = userId
            };

        string json =
            JsonUtility.ToJson(
                requestBody
            );

        yield return PostJson(
            "/api/cortex/insights",
            json
        );
    }

    IEnumerator PostJson(
        string endpoint,
        string json
    )
    {
        string url =
            baseUrl +
            endpoint;

        UnityWebRequest request =
            new UnityWebRequest(
                url,
                "POST"
            );

        byte[] bodyRaw =
            Encoding.UTF8.GetBytes(
                json
            );

        request.uploadHandler =
            new UploadHandlerRaw(
                bodyRaw
            );

        request.downloadHandler =
            new DownloadHandlerBuffer();

        request.SetRequestHeader(
            "Content-Type",
            "application/json"
        );

        yield return request.SendWebRequest();

        if (
            request.result !=
            UnityWebRequest.Result.Success
        )
        {
            Debug.LogError(
                "API Error: " +
                request.error
            );

            Debug.LogError(
                request.downloadHandler.text
            );
        }
        else
        {
            Debug.Log(
                "API Response: " +
                request.downloadHandler.text
            );
        }
    }
}

[System.Serializable]
public class WalkRequest
{
    public string userId;
    public string petName;
    public float distanceMiles;
    public float durationMinutes;
    public string locationName;
    public string petMood;
}

[System.Serializable]
public class ChatRequest
{
    public string userId;
    public string petName;
    public string message;
    public float walkDistanceMiles;
    public string petMood;
    public string threadId;
}

[System.Serializable]
public class InsightRequest
{
    public string userId;
}

[System.Serializable]
public class ChatResponse
{
    public bool success;
    public string aiResponse;
    public string threadId;
}