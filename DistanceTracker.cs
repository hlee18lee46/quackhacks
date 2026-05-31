using TMPro;
using UnityEngine;

public class DistanceTracker : MonoBehaviour
{
    [Header("UI Elements")]
    [SerializeField] private TMP_Text milesText;
    [SerializeField] private TMP_Text stepsText;

    [Header("Tracking Settings")]
    [Tooltip("The AR Camera to track. Defaults to Camera.main if left empty.")]
    [SerializeField] private Transform arCamera;
    
    [Tooltip("Minimum frame distance to prevent AR camera drift/jitter from adding fake distance.")]
    [SerializeField] private float noiseThresholdMeters = 0.01f; 
    
    [Tooltip("Average step length in meters.")]
    [SerializeField] private float stepLengthMeters = 0.75f;

    private Vector3 lastPosition;
    private float totalMeters = 0f;
    private bool isWalking = false;

    // Conversion constant: meters to miles
    private const float METERS_TO_MILES = 1609.344f;

    void Start()
    {
        InitializeCamera();
        UpdateUI();
    }

    void Update()
    {
        if (!isWalking || arCamera == null) return;

        Vector3 currentPosition = arCamera.position;

        // Flatten tracking to XZ plane to ignore vertical head-bobbing/elevator movement
        Vector2 flatLast = new Vector2(lastPosition.x, lastPosition.z);
        Vector2 flatCurrent = new Vector2(currentPosition.x, currentPosition.z);

        float frameDistance = Vector2.Distance(flatLast, flatCurrent);

        // Check if the movement is real or just AR camera jitter
        if (frameDistance >= noiseThresholdMeters)
        {
            totalMeters += frameDistance;
            lastPosition = currentPosition; // Update baseline to current position
            UpdateUI();
        }
    }

    public void StartWalk()
    {
        InitializeCamera();

        if (arCamera == null)
        {
            Debug.LogError("DistanceTracker: AR Camera could not be found! Cannot start tracking.");
            return;
        }

        // Reset and initialize tracking baseline
        totalMeters = 0f;
        lastPosition = arCamera.position;
        isWalking = true;

        UpdateUI();
        Debug.Log("Walk started.");
    }

    public void StopWalk()
    {
        isWalking = false;
        Debug.Log($"Walk stopped. Final Distance: {GetMiles():F2} miles ({GetSteps()} steps).");
    }

    public float GetMiles()
    {
        return totalMeters / METERS_TO_MILES;
    }

    public int GetSteps()
    {
        if (stepLengthMeters <= 0) return 0;
        return Mathf.RoundToInt(totalMeters / stepLengthMeters);
    }

    private void InitializeCamera()
    {
        if (arCamera == null && Camera.main != null)
        {
            arCamera = Camera.main.transform;
        }
    }

    private void UpdateUI()
    {
        if (milesText != null)
        {
            milesText.text = $"Miles: {GetMiles():F2}";
        }

        if (stepsText != null)
        {
            stepsText.text = $"Steps: {GetSteps()}";
        }
    }
}