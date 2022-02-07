var spectrumDimensionScalar = 4.5
var spectrumMaxExponent = 5
var spectrumMinExponent = 3
var spectrumExponentScale = 2

var SpectrumStart = 4
var SpectrumEnd = 1200
var SpectrumLogScale = 2.55

var spectrumHeight = 255

function SpectrumEase(Value) {
    return Math.pow(Value, SpectrumLogScale)
}

function GetVisualBins(Array) {
    var SamplePoints = []
    var NewArray = []
    var LastSpot = 0
    for (var i = 0; i < SpectrumBarCount; i++) {
        var Bin = Math.round(SpectrumEase(i / SpectrumBarCount) * (SpectrumEnd - SpectrumStart) + SpectrumStart)
        if (Bin <= LastSpot) {
            Bin = LastSpot + 1
        }
        LastSpot = Bin
        SamplePoints[i] = Bin
    }

    var MaxSamplePoints = []
    for (var i = 0; i < SpectrumBarCount; i++) {
        var CurSpot = SamplePoints[i]
        var NextSpot = SamplePoints[i + 1]
        if (NextSpot == null) {
            NextSpot = SpectrumEnd
        }

        var CurMax = Array[CurSpot]
        var MaxSpot = CurSpot
        var Dif = NextSpot - CurSpot
        for (var j = 1; j < Dif; j++) {
            var NewSpot = CurSpot + j
            if (Array[NewSpot] > CurMax) {
                CurMax = Array[NewSpot]
                MaxSpot = NewSpot
            }
        }
        MaxSamplePoints[i] = MaxSpot
    }

    for (var i = 0; i < SpectrumBarCount; i++) {
        var CurSpot = SamplePoints[i]
        var NextMaxSpot = MaxSamplePoints[i]
        var LastMaxSpot = MaxSamplePoints[i - 1]
        if (LastMaxSpot == null) {
            LastMaxSpot = SpectrumStart
        }
        var LastMax = Array[LastMaxSpot]
        var NextMax = Array[NextMaxSpot]

        NewArray[i] = (LastMax + NextMax) / 2
    }

    return NewArray
}