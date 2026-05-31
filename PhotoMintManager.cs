using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class PhotoMintManager : MonoBehaviour
{
    [Header("References")]
    public WalkieApiClient apiClient;

    [Header("NFT")]
    public string recipientWallet;

    public void MintCurrentScreen()
    {
        StartCoroutine(CaptureAndMint());
    }

    IEnumerator CaptureAndMint()
    {
        yield return new WaitForEndOfFrame();

        Texture2D screenshot = new Texture2D(
            Screen.width,
            Screen.height,
            TextureFormat.RGB24,
            false
        );

        screenshot.ReadPixels(
            new Rect(0, 0, Screen.width, Screen.height),
            0,
            0
        );

        screenshot.Apply();

        byte[] imageBytes = screenshot.EncodeToPNG();

        Destroy(screenshot);

        StartCoroutine(
            MintPhotoCoroutine(
                imageBytes,
                recipientWallet
            )
        );
    }

    IEnumerator MintPhotoCoroutine(
        byte[] imageBytes,
        string wallet
    )
    {
        WWWForm form = new WWWForm();

        form.AddField("recipientWallet", wallet);
        form.AddField("petName", apiClient.petName);

        form.AddField("walkDistanceMiles", "2");
        form.AddField("durationMinutes", "32");
        form.AddField("locationName", "Neighborhood Park");

        form.AddBinaryData(
            "photo",
            imageBytes,
            "walkie-puppie.png",
            "image/png"
        );

        string url =
            apiClient.baseUrl + "/api/photo/mint";

        UnityWebRequest request =
            UnityWebRequest.Post(url, form);

        yield return request.SendWebRequest();

        Debug.Log("Mint Status: " + request.responseCode);
        Debug.Log(request.downloadHandler.text);

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error);
        }
    }
}