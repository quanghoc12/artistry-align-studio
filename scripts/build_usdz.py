import struct
import io
import zipfile
import zlib
import json
import os

def build_usdz():
    glb_path = 'public/models/Thap-rua-model.glb'
    orig_usdz_path = 'public/models/Thap-rua-model.original.usdz'
    out_usdz_path = 'public/models/Thap-rua-model.usdz'

    # 1. Extract textures from GLB
    with open(glb_path, 'rb') as f:
        f.seek(12)
        cl, ct = struct.unpack('<II', f.read(8))
        g = json.loads(f.read(cl))
        bl, bt = struct.unpack('<II', f.read(8))
        bin_start = f.tell()
        bv0 = g['bufferViews'][g['images'][0]['bufferView']]
        bv1 = g['bufferViews'][g['images'][1]['bufferView']]
        f.seek(bin_start + bv0['byteOffset'])
        img0 = f.read(bv0['byteLength'])
        f.seek(bin_start + bv1['byteOffset'])
        img1 = f.read(bv1['byteLength'])

    print(f"Extracted Texture 0 (tower): {len(img0)} bytes")
    print(f"Extracted Texture 1 (grass): {len(img1)} bytes")

    # 2. Extract geometries from existing USDZ
    orig_z = zipfile.ZipFile(orig_usdz_path)
    geom2 = orig_z.read('geometries/Geometry_2.usda')
    geom4 = orig_z.read('geometries/Geometry_4.usda')
    geom5 = orig_z.read('geometries/Geometry_5.usda')

    # 3. Create updated model.usda with complete texture wiring and realistic PBR settings
    model_usda = b'''#usda 1.0
(
\tcustomLayerData = {
\t\tstring creator = "Three.js USDZExporter Enhanced"
\t}
\tdefaultPrim = "Root"
\tmetersPerUnit = 1
\tupAxis = "Y"
)

def Xform "Root"
{
\tdef Scope "Scenes" (
\t\tkind = "sceneLibrary"
\t)
\t{
\t\tdef Xform "Scene" (
\t\t\tcustomData = {
\t\t\t\tbool preliminary_collidesWithEnvironment = 0
\t\t\t\tstring sceneName = "Scene"
\t\t\t}
\t\t\tsceneName = "Scene"
\t\t)
\t\t{
\t\t\ttoken preliminary:anchoring:type = "plane"
\t\t\ttoken preliminary:planeAnchoring:alignment = "horizontal"

\t\t\tdef Xform "Component7" (
\t\t\t\tprepend references = @./geometries/Geometry_2.usda@</Geometry>
\t\t\t\tprepend apiSchemas = ["MaterialBindingAPI"]
\t\t\t)
\t\t\t{
\t\t\t\tmatrix4d xformOp:transform = ( (-0.01904999976977706, 1.4586846969076933e-17, 2.4557879795892477e-16, 0), (2.455787979589247e-16, -1.2689849018106254e-17, 0.01904999976977706, 0), (1.458684696907713e-17, 0.01904999976977706, 1.4804823854457296e-17, 0), (0.09583104985771707, 0.020106879627598027, -0.07157170242598143, 1) )
\t\t\t\tuniform token[] xformOpOrder = ["xformOp:transform"]
\t\t\t\trel material:binding = </Materials/Material_8>
\t\t\t}

\t\t\tdef Xform "Edge"
\t\t\t{
\t\t\t\tmatrix4d xformOp:transform = ( (-0.01904999976977706, 0, 0, 0), (0, 4.2299496727020846e-18, -0.01904999976977706, 0), (0, 0.01904999976977706, 4.2299496727020846e-18, 0), (0.07783104049082379, 0.10035687899750767, 0.05507169686757853, 1) )
\t\t\t\tuniform token[] xformOpOrder = ["xformOp:transform"]
\t\t\t}

\t\t\tdef Xform "_443730"
\t\t\t{
\t\t\t\tmatrix4d xformOp:transform = ( (0.01904999976977706, 0, 0, 0), (0, 4.2299496727020846e-18, -0.01904999976977706, 0), (0, 0.01904999976977706, 4.2299496727020846e-18, 0), (-0.10108104047806393, 0.018606880360981508, 0.10119669475446774, 1) )
\t\t\t\tuniform token[] xformOpOrder = ["xformOp:transform"]

\t\t\t\tdef Xform "mesh_0" (
\t\t\t\t\tprepend references = @./geometries/Geometry_4.usda@</Geometry>
\t\t\t\t\tprepend apiSchemas = ["MaterialBindingAPI"]
\t\t\t\t)
\t\t\t\t{
\t\t\t\t\tmatrix4d xformOp:transform = ( (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1) )
\t\t\t\t\tuniform token[] xformOpOrder = ["xformOp:transform"]
\t\t\t\t\trel material:binding = </Materials/Material_9>
\t\t\t\t}

\t\t\t\tdef Xform "mesh_0_1" (
\t\t\t\t\tprepend references = @./geometries/Geometry_5.usda@</Geometry>
\t\t\t\t\tprepend apiSchemas = ["MaterialBindingAPI"]
\t\t\t\t)
\t\t\t\t{
\t\t\t\t\tmatrix4d xformOp:transform = ( (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1) )
\t\t\t\t\tuniform token[] xformOpOrder = ["xformOp:transform"]
\t\t\t\t\trel material:binding = </Materials/Material_10>
\t\t\t\t}
\t\t\t}
\t\t}
\t}
}

def "Materials"
{
\tdef Material "Material_8"
\t{
\t\ttoken outputs:surface.connect = </Materials/Material_8/PreviewSurface.outputs:surface>

\t\tdef Shader "PreviewSurface"
\t\t{
\t\t\tuniform token info:id = "UsdPreviewSurface"
\t\t\tcolor3f inputs:diffuseColor.connect = </Materials/Material_8/Texture_diffuse.outputs:rgb>
\t\t\tfloat inputs:roughness = 0.55
\t\t\tfloat inputs:metallic = 0.0
\t\t\tfloat inputs:opacity = 1
\t\t\tint inputs:useSpecularWorkflow = 0
\t\t\ttoken outputs:surface
\t\t}

\t\tdef Shader "PrimvarReader_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdPrimvarReader_float2"
\t\t\tfloat2 inputs:fallback = (0.0, 0.0)
\t\t\tstring inputs:varname = "st"
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Transform2d_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdTransform2d"
\t\t\tfloat2 inputs:in.connect = </Materials/Material_8/PrimvarReader_diffuse.outputs:result>
\t\t\tfloat inputs:rotation = 0
\t\t\tfloat2 inputs:scale = (1, 1)
\t\t\tfloat2 inputs:translation = (0, 0)
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Texture_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdUVTexture"
\t\t\tasset inputs:file = @textures/Texture_0.jpg@
\t\t\tfloat2 inputs:st.connect = </Materials/Material_8/Transform2d_diffuse.outputs:result>
\t\t\ttoken inputs:sourceColorSpace = "sRGB"
\t\t\ttoken inputs:wrapS = "repeat"
\t\t\ttoken inputs:wrapT = "repeat"
\t\t\tfloat outputs:r
\t\t\tfloat outputs:g
\t\t\tfloat outputs:b
\t\t\tfloat3 outputs:rgb
\t\t}
\t}

\tdef Material "Material_9"
\t{
\t\ttoken outputs:surface.connect = </Materials/Material_9/PreviewSurface.outputs:surface>

\t\tdef Shader "PreviewSurface"
\t\t{
\t\t\tuniform token info:id = "UsdPreviewSurface"
\t\t\tcolor3f inputs:diffuseColor.connect = </Materials/Material_9/Texture_diffuse.outputs:rgb>
\t\t\tfloat inputs:roughness = 0.55
\t\t\tfloat inputs:metallic = 0.0
\t\t\tfloat inputs:opacity = 1
\t\t\tint inputs:useSpecularWorkflow = 0
\t\t\ttoken outputs:surface
\t\t}

\t\tdef Shader "PrimvarReader_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdPrimvarReader_float2"
\t\t\tfloat2 inputs:fallback = (0.0, 0.0)
\t\t\tstring inputs:varname = "st"
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Transform2d_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdTransform2d"
\t\t\tfloat2 inputs:in.connect = </Materials/Material_9/PrimvarReader_diffuse.outputs:result>
\t\t\tfloat inputs:rotation = 0
\t\t\tfloat2 inputs:scale = (1, 1)
\t\t\tfloat2 inputs:translation = (0, 0)
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Texture_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdUVTexture"
\t\t\tasset inputs:file = @textures/Texture_0.jpg@
\t\t\tfloat2 inputs:st.connect = </Materials/Material_9/Transform2d_diffuse.outputs:result>
\t\t\ttoken inputs:sourceColorSpace = "sRGB"
\t\t\ttoken inputs:wrapS = "repeat"
\t\t\ttoken inputs:wrapT = "repeat"
\t\t\tfloat outputs:r
\t\t\tfloat outputs:g
\t\t\tfloat outputs:b
\t\t\tfloat3 outputs:rgb
\t\t}
\t}

\tdef Material "Material_10"
\t{
\t\ttoken outputs:surface.connect = </Materials/Material_10/PreviewSurface.outputs:surface>

\t\tdef Shader "PreviewSurface"
\t\t{
\t\t\tuniform token info:id = "UsdPreviewSurface"
\t\t\tcolor3f inputs:diffuseColor.connect = </Materials/Material_10/Texture_diffuse.outputs:rgb>
\t\t\tfloat inputs:roughness = 0.8
\t\t\tfloat inputs:metallic = 0.0
\t\t\tfloat inputs:opacity = 1
\t\t\tint inputs:useSpecularWorkflow = 0
\t\t\ttoken outputs:surface
\t\t}

\t\tdef Shader "PrimvarReader_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdPrimvarReader_float2"
\t\t\tfloat2 inputs:fallback = (0.0, 0.0)
\t\t\tstring inputs:varname = "st"
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Transform2d_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdTransform2d"
\t\t\tfloat2 inputs:in.connect = </Materials/Material_10/PrimvarReader_diffuse.outputs:result>
\t\t\tfloat inputs:rotation = 0
\t\t\tfloat2 inputs:scale = (1, 1)
\t\t\tfloat2 inputs:translation = (0, 0)
\t\t\tfloat2 outputs:result
\t\t}

\t\tdef Shader "Texture_diffuse"
\t\t{
\t\t\tuniform token info:id = "UsdUVTexture"
\t\t\tasset inputs:file = @textures/Texture_1.jpg@
\t\t\tfloat2 inputs:st.connect = </Materials/Material_10/Transform2d_diffuse.outputs:result>
\t\t\ttoken inputs:sourceColorSpace = "sRGB"
\t\t\ttoken inputs:wrapS = "repeat"
\t\t\ttoken inputs:wrapT = "repeat"
\t\t\tfloat outputs:r
\t\t\tfloat outputs:g
\t\t\tfloat outputs:b
\t\t\tfloat3 outputs:rgb
\t\t}
\t}
}
'''

    class USDZWriter:
        def __init__(self):
            self.buf = io.BytesIO()
            self.entries = []

        def add_file(self, filename, data):
            local_header_offset = self.buf.tell()
            fn_bytes = filename.encode('utf-8')
            raw_offset = local_header_offset + 30 + len(fn_bytes)
            padding = (64 - (raw_offset + 4) % 64) % 64
            extra = struct.pack('<HH', 0x0101, padding) + b'\x00' * padding
            crc = zlib.crc32(data)
            size = len(data)

            header = struct.pack('<IHHHHHIIIHH',
                0x04034b50, 20, 0, 0, 0, 0, crc, size, size, len(fn_bytes), len(extra))
            self.buf.write(header)
            self.buf.write(fn_bytes)
            self.buf.write(extra)
            data_offset = self.buf.tell()
            assert data_offset % 64 == 0, f'{filename} offset {data_offset} not 64-aligned'
            self.buf.write(data)

            self.entries.append({
                'filename': filename,
                'fn_bytes': fn_bytes,
                'extra': extra,
                'crc': crc,
                'size': size,
                'offset': local_header_offset
            })

        def finish(self):
            cd_start = self.buf.tell()
            for e in self.entries:
                cd_header = struct.pack('<IHHHHHHIIIHHHHHII',
                    0x02014b50, 20, 20, 0, 0, 0, 0,
                    e['crc'], e['size'], e['size'],
                    len(e['fn_bytes']), len(e['extra']), 0, 0, 0, 0, e['offset'])
                self.buf.write(cd_header)
                self.buf.write(e['fn_bytes'])
                self.buf.write(e['extra'])
            cd_len = self.buf.tell() - cd_start
            eocd = struct.pack('<IHHHHIIH',
                0x06054b50, 0, 0, len(self.entries), len(self.entries), cd_len, cd_start, 0)
            self.buf.write(eocd)
            return self.buf.getvalue()

    writer = USDZWriter()
    writer.add_file('model.usda', model_usda)
    writer.add_file('geometries/Geometry_2.usda', geom2)
    writer.add_file('geometries/Geometry_4.usda', geom4)
    writer.add_file('geometries/Geometry_5.usda', geom5)
    writer.add_file('textures/Texture_0.jpg', img0)
    writer.add_file('textures/Texture_1.jpg', img1)
    usdz_bytes = writer.finish()

    with open(out_usdz_path, 'wb') as f:
        f.write(usdz_bytes)

    print(f"Generated {out_usdz_path}: {len(usdz_bytes)} bytes")

    # Verify alignment
    verify_z = zipfile.ZipFile(out_usdz_path)
    for info in verify_z.infolist():
        fn_len = len(info.filename.encode('utf-8'))
        extra_len = len(info.extra)
        data_offset = info.header_offset + 30 + fn_len + extra_len
        print(f"  Entry: {info.filename:<30} size: {info.file_size:<10} offset: {data_offset:<10} mod64: {data_offset % 64}")

if __name__ == '__main__':
    build_usdz()

