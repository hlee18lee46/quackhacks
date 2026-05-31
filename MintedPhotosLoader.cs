using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using TMPro;

public class MintedPhotosLoader : MonoBehaviour
{
    [Header("API")]
    public string baseUrl = "https://quackhacks.vercel.app";
    public string userId = "user123";
    public int limit = 3;

    [Header("UI")]
    public RawImage[] photoImages;
    public TMP_Text statusText;

    private MintedPhoto[] loadedPhotos;

    [Serializable]
    public class MintedPhoto
    {
        public string nftName;
        public string petName;
        public string mintAddress;
        public string signature;
        public string explorer;
        public string txExplorer;
        public string imageUrl;
        public string metadataUri;
        public float walkDistanceMiles;
        public float durationMinutes;
        public string locationName;
        public string createdAt;
    }

    [Serializable]
    public class MintedPhotosResponse
    {
        public bool success;
        public int count;
        public MintedPhoto[] photos;
        public string error;
    }

    void Start()
    {
        StartCoroutine(LoadMintedPhotos());
    }

    IEnumerator LoadMintedPhotos()
    {
        if (statusText != null)
            statusText.text = "Loading puppy memories...";

        string url = $"{baseUrl}/api/photo/recent?userId={userId}&limit={limit}";

        using UnityWebRequest request = UnityWebRequest.Get(url);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error);

            if (statusText != null)
                statusText.text = "Failed to load NFT photos";

            yield break;
        }

        string json = request.downloadHandler.text;
        MintedPhotosResponse response = JsonUtility.FromJson<MintedPhotosResponse>(json);

        if (response == null || !response.success)
        {
            if (statusText != null)
                statusText.text = response != null ? response.error : "Invalid server response";

            yield break;
        }

        loadedPhotos = response.photos;

        if (statusText != null)
            statusText.text = $"Loaded {response.count} memories";

        for (int i = 0; i < photoImages.Length; i++)
        {
            if (i < loadedPhotos.Length && !string.IsNullOrEmpty(loadedPhotos[i].imageUrl))
            {
                photoImages[i].gameObject.SetActive(true);
                StartCoroutine(LoadImage(loadedPhotos[i].imageUrl, photoImages[i]));
            }
            else
            {
                photoImages[i].gameObject.SetActive(false);
            }
        }
    }

    IEnumerator LoadImage(string imageUrl, RawImage targetImage)
    {
        using UnityWebRequest request = UnityWebRequestTexture.GetTexture(imageUrl);
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Image load failed: " + request.error);
            yield break;
        }

        Texture2D texture = DownloadHandlerTexture.GetContent(request);
        targetImage.texture = texture;
    }

    public void OpenPhotoExplorer(int index)
    {
        if (loadedPhotos == null) return;
        if (index < 0 || index >= loadedPhotos.Length) return;

        string url = loadedPhotos[index].explorer;

        if (string.IsNullOrEmpty(url))
            url = loadedPhotos[index].txExplorer;

        if (!string.IsNullOrEmpty(url))
        {
            Application.OpenURL(url);
        }
    }
}