//
//  GeofenceModule.swift
//  geoLocation
//
//  Created by Indu Pal on 25/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit
import CoreLocation

@objc(GeofenceModule)
class GeofenceModule: RCTEventEmitter, CLLocationManagerDelegate {
  
  let locationManager:CLLocationManager = CLLocationManager()
  
  @objc func setGeofenceValues(_ dummyLocationList: Array<Any>, callback: RCTResponseSenderBlock) {
//    print(dummyLocationList)
    for data in dummyLocationList as! NSArray {
      if let val = data as? NSDictionary
      {
        let lati = val.value(forKey: "lat") as! NSNumber
        let long = val.value(forKey: "lng") as! NSNumber
        let radius = val.value(forKey: "radius")
        let id = val.value(forKey: "id")
        
        setGeofence(latitude: lati.floatValue , longitude: long.floatValue, radius: radius as! Int, id: id as! String)
      }
    }
    callback([true, NSNull()]);
  }
  func setGeofence(latitude: Float, longitude: Float, radius: Int, id: String) {
    locationManager.delegate = self
    locationManager.requestAlwaysAuthorization()
    locationManager.startUpdatingLocation()
    
    let geoRegion:CLCircularRegion = CLCircularRegion(center: CLLocationCoordinate2D(latitude: CLLocationDegrees(latitude), longitude: CLLocationDegrees(longitude)), radius: CLLocationDistance(radius), identifier: id)
    
    locationManager.startMonitoring(for: geoRegion)
    locationManager.startUpdatingLocation()
  }
  
  
//  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
//    for currentLocation in locations{
//      print("\(index): \(currentLocation)")
//      // "0: [locations]"
//    }
//  }
  
  func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
    print("Entered in walkin: \(region.identifier)")
    sendEvent(withName: "onEnter", body: ["id": region.identifier])
  }
  
  func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
    print("Exited from walkin: \(region.identifier)")
    sendEvent(withName: "onExit", body: ["id": region.identifier])
  }
  
  override func supportedEvents() -> [String]! {
    return ["onEnter", "onExit"]
  }
//  override static func requiresMainQueueSetup() { }
}

