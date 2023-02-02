/**
 * @file    tree_mesh_builder.cpp
 *
 * @author  Pavel Šesták <xsesta07@stud.fit.vutbr.cz>
 *
 * @brief   Parallel Marching Cubes implementation using OpenMP tasks + octree early elimination
 *
 * @date    06.dec.2022
 **/

#include <iostream>
#include <math.h>
#include <limits>

#include "tree_mesh_builder.h"

TreeMeshBuilder::TreeMeshBuilder(unsigned gridEdgeSize)
    : BaseMeshBuilder(gridEdgeSize, "Octree")
{

}

bool TreeMeshBuilder::SurfaceIsNotHere(Vec3_t<float> zero_position, const ParametricScalarField &field, float GridSize)
{
    Vec3_t<float> mid = {(zero_position.x + GridSize) * mGridResolution,
                         (zero_position.y + GridSize) * mGridResolution,
                         (zero_position.z + GridSize) * mGridResolution};
    float field_value = evaluateFieldAt(mid, field);
    return ((mIsoLevel + SQRT3 * GridSize * mGridResolution) < field_value); 
}

unsigned TreeMeshBuilder::octTree(Vec3_t<float> zero_position, unsigned mGridSizeLocal, const ParametricScalarField &field){
    
    if(mGridSizeLocal <= MINSIZE){
        return buildCube(zero_position, field);
    }
    
    unsigned newGridSize = mGridSizeLocal >> 1; //divide by 2, mGridSizeLocal is power of 2
    float f_newGridSize = float(newGridSize);

    if(SurfaceIsNotHere(zero_position, field, f_newGridSize)){
        return 0;
    }

    unsigned total_triangles = 0;

    for(int i = 0; i < 8; i++){
        
        Vec3_t<float> newZeroPosition = {zero_position.x + (sc_vertexNormPos[i].x * f_newGridSize),
                                         zero_position.y + (sc_vertexNormPos[i].y * f_newGridSize),
                                         zero_position.z + (sc_vertexNormPos[i].z * f_newGridSize)};

        #pragma omp task shared(total_triangles) final(newGridSize < 4)
        {
            unsigned sub_total_triangles = octTree(newZeroPosition, newGridSize, field);

            #pragma omp atomic update
            total_triangles += sub_total_triangles;
        }
    }

    
    #pragma omp taskwait
    return total_triangles;
}

unsigned TreeMeshBuilder::marchCubes(const ParametricScalarField &field)
{
    unsigned totalTriangles = 0;
    Vec3_t <float> zero_postition = {0.0, 0.0, 0.0};

    unsigned threads = 0;
    #pragma omp parallel
    {
        #pragma omp single
        {
            threads = omp_get_num_threads();
            mTrianglesPrivate.resize(threads);
            totalTriangles = octTree(zero_postition, mGridSize, field);
        }

    }
    for(int i = 0; i < threads; i++){
        mTriangles.insert(mTriangles.end(), mTrianglesPrivate[i].begin(), mTrianglesPrivate[i].end());
    }

    return totalTriangles;
}

float TreeMeshBuilder::evaluateFieldAt(const Vec3_t<float> &pos, const ParametricScalarField &field)
{
    const Vec3_t<float> *pPoints = field.getPoints().data();
    const unsigned count = unsigned(field.getPoints().size());

    float value = std::numeric_limits<float>::max();

    #pragma omp simd reduction(min: value) simdlen(16)
    for(unsigned i = 0; i < count; ++i){
        float deltaX = pos.x - pPoints[i].x;
        float deltaY = pos.y - pPoints[i].y;
        float deltaZ = pos.z - pPoints[i].z;

        float distanceSquared  = deltaX * deltaX;
        distanceSquared       += deltaY * deltaY;
        distanceSquared       += deltaZ * deltaZ;
        
        value = std::min(value, distanceSquared);
    }

    return sqrt(value);
}

void TreeMeshBuilder::emitTriangle(const BaseMeshBuilder::Triangle_t &triangle)
{    
    //mTriangles.push_back(triangle);
    mTrianglesPrivate[omp_get_thread_num()].push_back(triangle);
}
