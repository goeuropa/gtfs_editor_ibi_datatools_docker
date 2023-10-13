# Appendix: Common GTFS Validation Warnings

Some preface here is necessary to say that although these warnings are at the detailed feed level, they are also available to the admin users in Data Manager and as such need to be in both places.  However, it should be stated that the fix to these for fetched and manually-updated feeds does not happen here in Data Manager or in GTFS Editor.  These happen upstream in the data production of those feed originators.

### Route Short and Long Names Are Blank
A route is missing either a short or long name. *Both a short name and long name are required by the GTFS specification.*

### Route Short Name is Too Long
A route’s short name field has too many characters. *The route short name should not be longer than 3-4 characters, since GTFS-consuming applications may use the short name in contexts where there is limited space for text (e.g. labels on a map).*

### Route Long Name Contains Short Name
A route’s short name is included within the long name. *The route long name should not contain the short name, since GTFS-consuming applications may combine the long and short names for a single combined name (e.g. a route with short name “A” and long name “8th Avenue Express” may be rendered as “A - 8th Avenue Express”).*

### Route Description Same as Route Name
A route’s description and name are identical. *The route description is an optional field and should only be included if it provides additional information beyond what is included in the route name.*

### Route Type Invalid Valid
A route type specified does not match the set of GTFS defined route type values. *The allowed values for the route type field are defined in the GTFS specification and currently include 8 different transit modes (tram, subway, rail, bus, ferry, cable car, gondola, funicular).*

### No Stop Times for Trip
A trip contains no stop time information. *This indicates that the timetable information for this trip is incorrect.*

### Stop Time Departure before Arrival
A trip departs a stop prior to arriving. *This indicates that the timetable information for this trip is incorrect.*

### Stop Times Out Of Sequence
A trip arrives prior to departing a preceding stop. *This indicates that the timetable information for this trip is incorrect.*

### Duplicate Trip
Two or more trips share the same stop sequence and departure times. *This indicates duplicate trips may exist.*

### Overlapping Trips in Block
Two or more trips within a single block overlap.  *A block represents a sequence of trips operated by a single vehicle, and block ID is an optional field indicating which block a vehicle trip belongs to. If block numbering is used in the trip record, and two or more trips overlap in time but share a common block ID, then this indicates either incorrect schedule information or incorrect block IDs.*

### Duplicate Stops
Two stops exist in the same location within a feed. *Consider merging stops sharing a common location or use station/stop hierarchy to specify locations within a group of stops.*

### Reversed Trip Shape
The direction of the trip shape does not match the direction of the stop sequence. *Either reverse or correct the trip shape to match the order of the stops serviced by this trip.*

### Missing Shape
The trip does not specify a shape. *Shapes are optional but recommended.*
