using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class PlaceGLBOnTap : MonoBehaviour
{
    [Header("AR References")]
    public GameObject objectToPlace;
    public ARRaycastManager raycastManager;

    [Header("Placement Filter Settings")]
    [Tooltip("Minimum distance (in meters) the floor must be below the phone camera to prevent immediate floating placement glitches.")]
    public float minDistanceBelowCamera = 0.4f;

    private static List<ARRaycastHit> hits = new List<ARRaycastHit>();
    private GameObject puppy;

    void Update()
    {
        // 1. If there are no touches on the screen, do nothing
        if (Input.touchCount == 0) return;

        Touch touch = Input.GetTouch(0);
        
        // 2. Only trigger placement on the initial touch down phase
        if (touch.phase != TouchPhase.Began) return;

        // 3. Mobile UI Safety Check: If the user is tapping a UI button, abort placement
        if (IsPointerOverUI(touch)) return;

        // 4. Perform the AR Raycast against trackable polygons (surfaces)
        if (raycastManager.Raycast(touch.position, hits, TrackableType.PlaneWithinPolygon))
        {
            ARRaycastHit hit = hits[0];
            ARPlane plane = hit.trackable as ARPlane;

            // 5. Plane Validation Filters
            if (plane == null) return;
            
            // Skip planes that are currently merging/subsumed into larger planes
            if (plane.subsumedBy != null) return;
            
            // Only allow upward-facing horizontal planes (floors/tables)
            if (plane.alignment != PlaneAlignment.HorizontalUp) return;

            // 6. Anti-Float Check: Calculate the vertical distance between the camera and the hit surface.
            // If it's too close to the camera's start height, it's a floating initialization glitch.
            float distanceBelowCamera = Camera.main.transform.position.y - hit.pose.position.y;
            if (distanceBelowCamera < minDistanceBelowCamera) return;

            Pose hitPose = hit.pose;

            // 7. Instantiate or Reposition the Puppy
            if (puppy == null)
            {
                puppy = Instantiate(objectToPlace, hitPose.position, Quaternion.identity);
                puppy.transform.localScale = new Vector3(0.005f, 0.005f, 0.005f);
            }
            else
            {
                // Move the puppy to the newly verified real floor position
                puppy.transform.position = hitPose.position;
                puppy.SetActive(true); 
            }
        }
    }

    /// <summary>
    /// Robust UI detector ensuring cross-platform stability for Unity Editor and iOS/Android touches.
    /// </summary>
    private bool IsPointerOverUI(Touch touch)
    {
        if (EventSystem.current == null) return false;
        
        if (EventSystem.current.IsPointerOverGameObject()) return true;
        if (EventSystem.current.IsPointerOverGameObject(touch.fingerId)) return true;

        return false;
    }

    /// <summary>
    /// Public method to hook up to your UI Button's On Click () event.
    /// Completely destroys the floating puppy so you can re-tap onto the stable floor.
    /// </summary>
    public void ResetPuppy()
    {
        if (puppy != null)
        {
            Destroy(puppy);
            puppy = null;
        }
    }
}