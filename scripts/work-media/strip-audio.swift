// Removes the audio track from a video without re-encoding it. The loops autoplay muted,
// so the sound would only be extra bytes (and publicly downloadable).
//   swift scripts/work-media/strip-audio.swift in.mp4 out.mp4
import AVFoundation

let args = CommandLine.arguments
guard args.count == 3 else { fatalError("usage: strip-audio.swift in.mp4 out.mp4") }
let out = URL(fileURLWithPath: args[2])
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let source = try await asset.loadTracks(withMediaType: .video)[0]
let movie = AVMutableComposition()
let track = movie.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
try track.insertTimeRange(try await source.load(.timeRange), of: source, at: .zero)
track.preferredTransform = try await source.load(.preferredTransform)
let export = AVAssetExportSession(asset: movie, presetName: AVAssetExportPresetPassthrough)!
export.shouldOptimizeForNetworkUse = true
try? FileManager.default.removeItem(at: out)
try await export.export(to: out, as: .mp4)
